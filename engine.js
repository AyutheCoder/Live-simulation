// ============================================================
// engine.js — Workflow Execution Engine (v2 with Speed Control)
// ============================================================

class WorkflowEngine {
  constructor() {
    this.scenario = null;
    this.currentStepIndex = -1;
    this.isRunning = false;
    this.isPaused = false;
    this.listeners = {};
    this.speed = 1;
    this.baseDelay = 1800;
    this.timeoutId = null;
    this.startTime = null;
    this.stepTimes = [];
    this.analytics = {
      totalSimulations: 0,
      approved: 0,
      rejected: 0,
      highRisk: 0,
      mediumRisk: 0,
      lowRisk: 0
    };
  }

  on(event, callback) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
  }

  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => cb(data));
    }
  }

  setSpeed(s) { this.speed = s; }

  loadScenario(scenario) {
    this.reset();
    this.scenario = JSON.parse(JSON.stringify(scenario));
    this.emit('scenario:loaded', this.scenario);
  }

  async start() {
    if (!this.scenario || this.isRunning) return;
    this.isRunning = true;
    this.isPaused = false;
    this.startTime = Date.now();
    this.stepTimes = [];
    this.emit('simulation:start', this.scenario);
    await this.runAllSteps();
  }

  pause() {
    this.isPaused = true;
    this.emit('simulation:paused', {});
  }

  resume() {
    if (!this.isPaused) return;
    this.isPaused = false;
    this.emit('simulation:resumed', {});
    this.runAllSteps();
  }

  async stepForward() {
    if (!this.scenario) return;
    if (!this.isRunning) {
      this.isRunning = true;
      this.isPaused = true;
      this.startTime = Date.now();
      this.stepTimes = [];
      this.emit('simulation:start', this.scenario);
    }
    await this.executeNextStep();
  }

  reset() {
    this.isRunning = false;
    this.isPaused = false;
    this.currentStepIndex = -1;
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    if (this.scenario) {
      this.scenario.workflowSteps.forEach(step => {
        if (step.status !== 'skip') step.status = 'pending';
      });
    }
    this.emit('simulation:reset', {});
  }

  async runAllSteps() {
    while (this.currentStepIndex < this.scenario.workflowSteps.length - 1) {
      if (this.isPaused) return;
      await this.executeNextStep();
      if (this.isPaused) return;
      await this.delay(this.baseDelay);
    }
    this.completeSimulation();
  }

  async executeNextStep() {
    this.currentStepIndex++;
    const steps = this.scenario.workflowSteps;
    if (this.currentStepIndex >= steps.length) {
      this.completeSimulation();
      return;
    }
    const step = steps[this.currentStepIndex];

    if (step.status === 'skip') {
      this.emit('step:skip', { step, index: this.currentStepIndex });
      return;
    }

    const stepStart = Date.now();
    step.status = 'active';
    this.emit('step:start', { step, index: this.currentStepIndex });

    switch (step.id) {
      case 'request':
        await this.delay(800);
        step.status = 'success';
        this.emit('step:complete', { step, index: this.currentStepIndex });
        break;
      case 'validation':
        await this.runValidation(step);
        break;
      case 'decisionTable':
        await this.runDecisionTable(step);
        break;
      case 'decisionTree':
        await this.runDecisionTree(step);
        break;
      case 'approval':
      case 'approval-security':
      case 'approval-compliance':
      case 'approval-auto':
        await this.runApproval(step);
        break;
      case 'provisioning':
        await this.runProvisioning(step);
        break;
      case 'verification':
        await this.delay(1000);
        step.status = 'success';
        this.emit('step:complete', { step, index: this.currentStepIndex });
        break;
      case 'closure':
        await this.delay(800);
        step.status = 'success';
        this.emit('step:complete', { step, index: this.currentStepIndex });
        break;
      case 'rejection':
        await this.delay(600);
        step.status = 'failed';
        this.emit('step:complete', { step, index: this.currentStepIndex, rejected: true });
        break;
      case 'notification':
        await this.delay(800);
        step.status = 'success';
        this.emit('step:complete', { step, index: this.currentStepIndex });
        break;
      default:
        await this.delay(800);
        step.status = 'success';
        this.emit('step:complete', { step, index: this.currentStepIndex });
    }
    this.stepTimes.push(Date.now() - stepStart);
  }

  async runValidation(step) {
    const checks = this.scenario.validationChecks;
    let allPassed = true;
    for (let i = 0; i < checks.length; i++) {
      await this.delay(500);
      this.emit('validation:check', { check: checks[i], index: i });
      if (checks[i].pass === false) {
        allPassed = false;
        this.emit('validation:fail', { check: checks[i], index: i });
        break;
      }
      if (checks[i].pass === null) {
        this.emit('validation:skip', { check: checks[i], index: i });
        break;
      }
    }
    step.status = allPassed ? 'success' : 'failed';
    this.emit('step:complete', { step, index: this.currentStepIndex, validationFailed: !allPassed });
  }

  async runDecisionTable(step) {
    await this.delay(400);
    this.emit('decisionTable:scan', {});
    for (let i = 0; i < DECISION_TABLE.length; i++) {
      await this.delay(600);
      const isMatch = i === this.scenario.decisionTableRow;
      this.emit('decisionTable:row', { row: DECISION_TABLE[i], index: i, isMatch });
      if (isMatch) {
        await this.delay(400);
        this.emit('decisionTable:match', { row: DECISION_TABLE[i], index: i, result: this.scenario.decisionTableResult });
        break;
      }
    }
    step.status = 'success';
    this.emit('step:complete', { step, index: this.currentStepIndex });
  }

  async runDecisionTree(step) {
    const path = this.scenario.decisionTreePath;
    for (let i = 0; i < path.length; i++) {
      await this.delay(1200);
      this.emit('decisionTree:node', { node: path[i], index: i, isLast: i === path.length - 1 });
    }
    await this.delay(600);
    this.emit('decisionTree:result', { riskLevel: this.scenario.riskLevel });
    step.status = 'success';
    this.emit('step:complete', { step, index: this.currentStepIndex });
  }

  async runApproval(step) {
    await this.delay(1200);
    step.status = 'success';
    this.emit('approval:complete', { step, index: this.currentStepIndex });
    this.emit('step:complete', { step, index: this.currentStepIndex });
  }

  async runProvisioning(step) {
    const totalDuration = 2000;
    const intervals = 20;
    const intervalTime = totalDuration / intervals;
    for (let i = 1; i <= intervals; i++) {
      await this.delay(intervalTime);
      this.emit('provisioning:progress', { percent: Math.round((i / intervals) * 100) });
    }
    step.status = 'success';
    this.emit('step:complete', { step, index: this.currentStepIndex });
  }

  completeSimulation() {
    this.isRunning = false;
    this.analytics.totalSimulations++;
    if (this.scenario.finalStatus === 'approved') this.analytics.approved++;
    else this.analytics.rejected++;
    if (this.scenario.riskLevel === 'High') this.analytics.highRisk++;
    else if (this.scenario.riskLevel === 'Medium') this.analytics.mediumRisk++;
    else if (this.scenario.riskLevel === 'Low') this.analytics.lowRisk++;
    const totalTime = Date.now() - this.startTime;
    this.emit('simulation:complete', {
      scenario: this.scenario, totalTime, stepTimes: this.stepTimes, analytics: this.analytics
    });
  }

  delay(ms) {
    const adjusted = Math.max(ms / this.speed, 50);
    return new Promise(resolve => { this.timeoutId = setTimeout(resolve, adjusted); });
  }

  getAnalytics() { return { ...this.analytics }; }
}
