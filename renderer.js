// ============================================================
// renderer.js — Cinematic Renderer v2
// ============================================================

class WorkflowRenderer {
  constructor(engine) {
    this.engine = engine;
    this.logEntries = [];
    this.timelineStart = null;
    this.narrationTimer = null;
    this.bindEvents();
    this.bindUI();
  }

  bindEvents() {
    const e = this.engine;
    e.on('scenario:loaded', s => this.renderScenario(s));
    e.on('simulation:start', s => this.onStart(s));
    e.on('simulation:paused', () => this.onPaused());
    e.on('simulation:resumed', () => this.onResumed());
    e.on('simulation:reset', () => this.onReset());
    e.on('simulation:complete', d => this.onComplete(d));
    e.on('step:start', d => this.onStepStart(d));
    e.on('step:complete', d => this.onStepComplete(d));
    e.on('step:skip', d => this.onStepSkip(d));
    e.on('validation:check', d => this.onValCheck(d));
    e.on('validation:fail', d => this.onValFail(d));
    e.on('validation:skip', d => this.onValSkip(d));
    e.on('decisionTable:scan', () => this.onDTScan());
    e.on('decisionTable:row', d => this.onDTRow(d));
    e.on('decisionTable:match', d => this.onDTMatch(d));
    e.on('decisionTree:node', d => this.onTreeNode(d));
    e.on('decisionTree:result', d => this.onTreeResult(d));
    e.on('approval:complete', d => this.onApproval(d));
    e.on('provisioning:progress', d => this.onProvision(d));
  }

  bindUI() {
    // Modal
    document.getElementById('modal-close').addEventListener('click', () => this.closeModal());
    document.getElementById('stage-modal').addEventListener('click', e => {
      if (e.target.id === 'stage-modal') this.closeModal();
    });
    // Tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(btn.dataset.tab).classList.add('active');
      });
    });
  }

  // ─── Render Scenario ───
  renderScenario(scenario) {
    this.logEntries = [];
    this.timelineStart = null;
    this.clearNarration();

    // Info
    document.getElementById('info-employee').textContent = scenario.inputs.employeeName;
    document.getElementById('info-type').textContent = scenario.inputs.employeeType;
    document.getElementById('info-resource').textContent = scenario.inputs.resourceName;
    document.getElementById('info-access').textContent = scenario.inputs.accessType;
    document.getElementById('info-criticality').textContent = scenario.inputs.criticalityLevel;
    document.getElementById('info-days').textContent = scenario.inputs.numberOfDays + ' days';
    document.getElementById('info-justification').textContent = scenario.inputs.businessJustification;

    // Theme
    document.documentElement.style.setProperty('--accent', scenario.themeColor);

    // Header
    document.getElementById('top-scenario-name').textContent = `Scenario ${scenario.id}: ${scenario.name}`;
    const badge = document.getElementById('top-badge');
    badge.textContent = scenario.badge;
    badge.style.background = scenario.badgeColor + '18';
    badge.style.color = scenario.badgeColor;
    badge.style.borderColor = scenario.badgeColor + '44';

    // Story
    document.getElementById('request-story').textContent = scenario.story;

    // Flow chart
    this.renderFlowChart(scenario);

    // Decision Table
    this.renderDT();

    // Decision Tree
    this.renderTree(scenario);

    // Approvals
    this.renderApprovals(scenario);

    // Validation
    this.renderValChecks(scenario);

    // Reset panels
    this.resetProvision();
    this.clearLog();
    this.clearTimeline();
    this.clearRules();
    this.hideBanner();
    this.hideAlert();
    this.updateAnalytics();

    // Educational note
    const edu = document.getElementById('edu-note');
    edu.textContent = scenario.educationalNote;

    // Controls
    document.getElementById('btn-start').disabled = false;
    document.getElementById('btn-pause').disabled = true;
    document.getElementById('btn-step').disabled = false;
    document.getElementById('btn-reset').disabled = true;

    // Set narration
    this.setNarration('💡', 'Ready to simulate. Press ▶ Start or hit Spacebar to begin the workflow animation.');
  }

  renderFlowChart(scenario) {
    const container = document.getElementById('flow-chart');
    container.innerHTML = '';
    scenario.workflowSteps.forEach((step, i) => {
      if (i > 0) {
        const line = document.createElement('div');
        line.className = 'flow-line';
        line.id = `flow-line-${i}`;
        line.innerHTML = '<div class="flow-line-inner"></div>';
        container.appendChild(line);
      }
      const node = document.createElement('div');
      node.className = `flow-node ${step.status === 'skip' ? 'state-skip' : ''}`;
      node.id = `flow-node-${i}`;
      node.innerHTML = `
        <div class="node-circle">${step.icon}</div>
        <div class="node-label">${step.label}</div>
        <div class="node-status"></div>
      `;
      node.addEventListener('click', () => this.showModal(step, scenario));
      container.appendChild(node);
    });
  }

  renderDT() {
    const tbody = document.getElementById('dt-body');
    tbody.innerHTML = '';
    DECISION_TABLE.forEach((row, i) => {
      const tr = document.createElement('tr');
      tr.id = `dt-row-${i}`;
      tr.innerHTML = `<td><span class="dt-num">${i + 1}</span></td><td>${row.resource}</td><td><code class="dt-route">${row.routeTo}</code></td>`;
      tbody.appendChild(tr);
    });
  }

  renderTree(scenario) {
    const container = document.getElementById('tree-vis');
    container.innerHTML = '';
    if (!scenario.decisionTreeTriggered) {
      container.innerHTML = '<div class="tree-not-triggered">⏭ Decision Tree not triggered for this route</div>';
      return;
    }
    const allQ = [
      { q: "Q1: Access = Admin/Delete?" },
      { q: "Q2: Criticality = High?" },
      { q: "Q3: Modify + Medium?" },
      { q: "Q4: Days > 90?" },
      { q: "Q5: Write/Modify?" }
    ];
    const pathLen = scenario.decisionTreePath.length;
    allQ.forEach((qObj, i) => {
      if (i > 0) {
        const conn = document.createElement('div');
        conn.className = 'tree-connector';
        conn.id = `tree-conn-${i}`;
        container.appendChild(conn);
      }
      const pathEntry = scenario.decisionTreePath[i];
      const isTerminal = pathEntry && pathEntry.result !== null;
      const div = document.createElement('div');
      div.className = 'tree-node';
      div.id = `tree-node-${i}`;
      div.innerHTML = `
        <div class="tree-q">${qObj.q}</div>
        <div class="tree-branches">
          <span class="tree-branch tree-yes" id="tree-yes-${i}">YES</span>
          <span class="tree-branch tree-no" id="tree-no-${i}">NO</span>
        </div>
        ${isTerminal ? `<div class="tree-result-tag" id="tree-result-${i}"></div>` : ''}
      `;
      container.appendChild(div);
      if (isTerminal) return; // stop rendering after terminal
    });
  }

  renderApprovals(scenario) {
    const container = document.getElementById('approval-grid');
    container.innerHTML = '';
    const allRoles = [
      { role: 'Manager', icon: '👤', label: 'Manager' },
      { role: 'Resource Owner', icon: '🏢', label: 'Resource Owner' },
      { role: 'Security Team', icon: '🛡️', label: 'Security Team' },
      { role: 'Compliance Team', icon: '📜', label: 'Compliance Team' },
      { role: 'Auto-Approve', icon: '⚡', label: 'Auto-Approve' }
    ];
    const activeRoles = scenario.approvers.map(a => a.role);
    const skippedRoles = scenario.skippedApprovers || [];
    allRoles.forEach(r => {
      const isActive = activeRoles.includes(r.role);
      const isSkipped = skippedRoles.includes(r.role);
      if (!isActive && !isSkipped) return;
      const approverData = scenario.approvers.find(a => a.role === r.role);
      const card = document.createElement('div');
      card.className = `appr-card ${isSkipped ? 'appr-skipped' : 'appr-pending'}`;
      card.id = `appr-${r.role.replace(/\s+/g, '-').toLowerCase()}`;
      card.innerHTML = `
        <div class="appr-icon">${r.icon}</div>
        <div class="appr-role">${r.label}</div>
        <div class="appr-name">${approverData ? approverData.name : ''}</div>
        <div class="appr-status">${isSkipped ? 'Not Required' : 'Pending'}</div>
      `;
      container.appendChild(card);
    });
  }

  renderValChecks(scenario) {
    const container = document.getElementById('val-checks');
    container.innerHTML = '';
    scenario.validationChecks.forEach(c => {
      const div = document.createElement('div');
      div.className = 'val-item val-pending';
      div.innerHTML = `<span class="val-icon">○</span> ${c.check}`;
      container.appendChild(div);
    });
  }

  // ─── Simulation Events ───
  onStart(scenario) {
    this.timelineStart = Date.now();
    this.addLog('🚀', 'Simulation', 'Started');
    this.addTimeline('Simulation Started');
    document.getElementById('btn-start').disabled = true;
    document.getElementById('btn-pause').disabled = false;
    document.getElementById('btn-step').disabled = false;
    document.getElementById('btn-reset').disabled = false;
    this.hideBanner();
    this.hideAlert();
  }

  onPaused() {
    const btn = document.getElementById('btn-pause');
    btn.textContent = '▶ Resume';
    btn.classList.add('btn-resume');
  }

  onResumed() {
    const btn = document.getElementById('btn-pause');
    btn.textContent = '⏸ Pause';
    btn.classList.remove('btn-resume');
  }

  onReset() {
    this.hideBanner();
    this.hideAlert();
    if (this.engine.scenario) this.renderScenario(this.engine.scenario);
  }

  // ─── Step Events ───
  onStepStart(data) {
    const { step, index } = data;
    const node = document.getElementById(`flow-node-${index}`);
    if (node) {
      node.className = 'flow-node state-active';
      node.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
    // Activate flow line
    const line = document.getElementById(`flow-line-${index}`);
    if (line) line.classList.add('line-active');

    // Narration
    if (step.narration) this.typeNarration(step.icon, step.narration);

    this.addLog('⏳', step.label, 'Processing...');
    this.addTimeline(`${step.label} started`);
  }

  onStepComplete(data) {
    const { step, index } = data;
    const isFailed = step.status === 'failed' || data.validationFailed || data.rejected;
    const node = document.getElementById(`flow-node-${index}`);
    if (node) {
      node.className = `flow-node ${isFailed ? 'state-failed' : 'state-success'}`;
      const statusEl = node.querySelector('.node-status');
      if (statusEl) statusEl.textContent = isFailed ? '✘' : '✔';
    }
    this.addLog(isFailed ? '❌' : '✅', step.label, isFailed ? 'Failed' : 'Completed');
    this.addTimeline(`${step.label} ${isFailed ? 'failed' : 'completed'}`);
  }

  onStepSkip(data) {
    const { step, index } = data;
    const node = document.getElementById(`flow-node-${index}`);
    if (node) node.className = 'flow-node state-skip';
    if (step.narration) this.setNarration('⏭', step.narration);
    this.addLog('⏭', step.label, 'Skipped');
  }

  // ─── Validation ───
  onValCheck(data) {
    const container = document.getElementById('val-checks');
    const el = container.children[data.index];
    if (el) {
      el.className = 'val-item val-pass';
      el.innerHTML = `<span class="val-icon">✔</span> ${data.check.check}`;
    }
  }

  onValFail(data) {
    const container = document.getElementById('val-checks');
    const el = container.children[data.index];
    if (el) {
      el.className = 'val-item val-fail';
      el.innerHTML = `<span class="val-icon">✘</span> ${data.check.check}<div class="val-fail-reason">${data.check.failReason || 'Failed'}</div>`;
    }
    this.addRule('Validation', data.check.failReason || 'Failed', 'fail');
  }

  onValSkip(data) {
    const container = document.getElementById('val-checks');
    const el = document.createElement('div');
    el.className = 'val-item val-pending';
    el.innerHTML = `<span class="val-icon">–</span> ${data.check.check} <em style="font-size:.7rem;color:var(--text-dim)">(not reached)</em>`;
    container.appendChild(el);
  }

  // ─── Decision Table ───
  onDTScan() { this.addRule('Decision Table', 'Scanning for matching resource...', 'info'); }

  onDTRow(data) {
    const row = document.getElementById(`dt-row-${data.index}`);
    if (row) {
      row.classList.add('dt-scanning');
      if (data.isMatch) {
        setTimeout(() => { row.classList.remove('dt-scanning'); row.classList.add('dt-matched'); }, 300);
      } else {
        setTimeout(() => { row.classList.remove('dt-scanning'); row.classList.add('dt-passed'); }, 300);
      }
    }
  }

  onDTMatch(data) {
    this.addLog('📊', 'Decision Table', `${data.row.resource} → ${data.result}`);
    this.addRule('Decision Table', `Matched Row ${data.index + 1}: "${data.row.resource}" → ${data.result}`, 'success');
  }

  // ─── Decision Tree ───
  onTreeNode(data) {
    const { node, index } = data;
    const el = document.getElementById(`tree-node-${index}`);
    if (el) {
      el.classList.add('glow');
      setTimeout(() => { el.classList.remove('glow'); el.classList.add('visited'); }, 500);
      const branchId = node.answer === 'YES' ? `tree-yes-${index}` : `tree-no-${index}`;
      const otherBranchId = node.answer === 'YES' ? `tree-no-${index}` : `tree-yes-${index}`;
      const branchEl = document.getElementById(branchId);
      const otherEl = document.getElementById(otherBranchId);
      if (branchEl) branchEl.classList.add('lit');
      if (otherEl) otherEl.classList.add('dim');
      if (node.result) {
        const resEl = document.getElementById(`tree-result-${index}`);
        if (resEl) {
          resEl.textContent = `→ ${node.result} Risk`;
          resEl.classList.add('show', node.result.toLowerCase());
        }
      }
    }
    // Light connector
    const conn = document.getElementById(`tree-conn-${index}`);
    if (conn) conn.classList.add('lit');

    this.addLog('🌳', node.question, `→ ${node.answer}${node.result ? ' → ' + node.result : ''}`);
    this.addRule('Decision Tree', `${node.question} → ${node.answer}${node.result ? '. Result: ' + node.result + ' Risk' : ''}`, 'info');
  }

  onTreeResult(data) {
    const badge = document.getElementById('risk-badge');
    if (badge && data.riskLevel) {
      badge.textContent = data.riskLevel + ' Risk';
      badge.className = `risk-badge show risk-${data.riskLevel.toLowerCase()}`;
    }
    if (this.engine.scenario && this.engine.scenario.id === 6) this.showAlert();
  }

  showAlert() {
    const el = document.getElementById('special-alert');
    el.innerHTML = `<span style="font-size:1.3rem">⚠️</span><div><strong>Days > 90 Detected!</strong> Duration alone increased the risk from Low to Medium. Compare with Scenario 5 (30 days).</div>`;
    el.classList.add('show');
  }

  hideAlert() { document.getElementById('special-alert').classList.remove('show'); }

  // ─── Approval ───
  onApproval(data) {
    const scenario = this.engine.scenario;
    scenario.approvers.forEach(a => {
      const card = document.getElementById(`appr-${a.role.replace(/\s+/g, '-').toLowerCase()}`);
      if (card) {
        card.className = 'appr-card appr-approved';
        card.querySelector('.appr-status').textContent = '✔ Approved';
      }
    });
    this.addRule('Approval', `${data.step.label} — Approved`, 'success');
  }

  // ─── Provisioning ───
  onProvision(data) {
    document.getElementById('provision-fill').style.width = data.percent + '%';
    document.getElementById('provision-pct').textContent = data.percent + '%';
    if (data.percent === 100) {
      const s = document.getElementById('provision-status');
      s.textContent = '✔ Access Granted';
      s.classList.add('provision-granted');
    }
  }

  resetProvision() {
    document.getElementById('provision-fill').style.width = '0%';
    document.getElementById('provision-pct').textContent = '0%';
    const s = document.getElementById('provision-status');
    s.textContent = 'Waiting...';
    s.classList.remove('provision-granted');
  }

  // ─── Completion ───
  onComplete(data) {
    const { scenario, totalTime } = data;
    if (scenario.finalStatus === 'approved') {
      this.showBanner('✅', 'Approved & Provisioned', `Scenario ${scenario.id} completed in ${(totalTime / 1000).toFixed(1)}s — ${scenario.totalSteps} steps`, 'banner-success');
      this.spawnConfetti();
      this.setNarration('🎉', `Simulation complete! ${scenario.name} — Approved & Provisioned in ${(totalTime / 1000).toFixed(1)} seconds.`);
    } else {
      this.showBanner('🚫', 'Request Rejected', scenario.rejectionReason, 'banner-rejected');
      this.setNarration('❌', `Simulation complete! Request REJECTED. ${scenario.rejectionReason}`);
    }
    this.addLog('🏁', 'Complete', scenario.finalStatus === 'approved' ? 'Approved' : 'Rejected');
    this.addTimeline('Simulation Complete');
    this.updateAnalytics();
    document.getElementById('btn-start').disabled = true;
    document.getElementById('btn-pause').disabled = true;
    document.getElementById('btn-step').disabled = true;
    document.getElementById('btn-reset').disabled = false;
  }

  showBanner(icon, title, detail, cls) {
    const el = document.getElementById('completion-banner');
    el.innerHTML = `<div class="banner-icon">${icon}</div><div class="banner-text"><strong>${title}</strong><span>${detail}</span></div>`;
    el.className = `banner show ${cls}`;
  }

  hideBanner() { document.getElementById('completion-banner').className = 'banner'; }

  // ─── Narration ───
  setNarration(icon, text) {
    if (this.narrationTimer) clearInterval(this.narrationTimer);
    document.getElementById('narr-icon').textContent = icon;
    document.getElementById('narr-text').innerHTML = text;
  }

  typeNarration(icon, text) {
    if (this.narrationTimer) clearInterval(this.narrationTimer);
    document.getElementById('narr-icon').textContent = icon;
    const el = document.getElementById('narr-text');
    el.innerHTML = '<span class="typing-cursor"></span>';
    let i = 0;
    const speed = Math.max(20, 40 / this.engine.speed);
    this.narrationTimer = setInterval(() => {
      if (i < text.length) {
        el.innerHTML = text.substring(0, i + 1) + '<span class="typing-cursor"></span>';
        i++;
      } else {
        el.innerHTML = text;
        clearInterval(this.narrationTimer);
        this.narrationTimer = null;
      }
    }, speed);
  }

  clearNarration() {
    if (this.narrationTimer) clearInterval(this.narrationTimer);
    document.getElementById('narr-icon').textContent = '💡';
    document.getElementById('narr-text').textContent = 'Select a scenario to begin.';
  }

  // ─── Confetti ───
  spawnConfetti() {
    const container = document.getElementById('confetti');
    container.innerHTML = '';
    const colors = ['#6366f1', '#22c55e', '#f59e0b', '#ec4899', '#3b82f6', '#10b981', '#f97316'];
    for (let i = 0; i < 80; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.left = Math.random() * 100 + '%';
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.animationDuration = (2 + Math.random() * 2) + 's';
      piece.style.animationDelay = Math.random() * 0.5 + 's';
      piece.style.width = (6 + Math.random() * 6) + 'px';
      piece.style.height = (6 + Math.random() * 6) + 'px';
      piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      container.appendChild(piece);
    }
    setTimeout(() => container.innerHTML = '', 4000);
  }

  // ─── Modal ───
  showModal(step, scenario) {
    const modal = document.getElementById('stage-modal');
    document.getElementById('modal-title').textContent = step.icon + ' ' + step.label;
    let html = '';

    if (step.id === 'validation') {
      html += '<h4>Validation Checks</h4><ul>';
      scenario.validationChecks.forEach(c => {
        const icon = c.pass === true ? '✅' : c.pass === false ? '❌' : '⏭️';
        html += `<li>${icon} ${c.check}${c.failReason ? ` — <em>${c.failReason}</em>` : ''}</li>`;
      });
      html += '</ul>';
    } else if (step.id === 'decisionTable') {
      html += `<h4>Decision Table</h4><p>Resource: <strong>${scenario.inputs.resourceName}</strong></p><p>Route: <strong>${scenario.decisionTableResult || 'N/A'}</strong></p>`;
    } else if (step.id === 'decisionTree') {
      html += '<h4>Decision Tree Path</h4><ul>';
      scenario.decisionTreePath.forEach(p => {
        html += `<li>${p.question} → <strong>${p.answer}</strong>${p.result ? ` → <strong>${p.result} Risk</strong>` : ''}</li>`;
      });
      html += `</ul>${scenario.riskLevel ? `<p style="margin-top:8px">Final Risk: <strong>${scenario.riskLevel}</strong></p>` : ''}`;
    } else {
      html += `<p><strong>Status:</strong> ${step.status}</p>`;
      if (step.narration) html += `<p style="margin-top:8px;color:var(--text-secondary)">${step.narration}</p>`;
    }
    if (step.skipReason) html += `<p style="margin-top:8px;color:var(--text-dim)"><em>${step.skipReason}</em></p>`;

    document.getElementById('modal-body-content').innerHTML = html;
    modal.classList.add('show');
  }

  closeModal() { document.getElementById('stage-modal').classList.remove('show'); }

  // ─── Log ───
  addLog(icon, title, detail) {
    const container = document.getElementById('exec-log');
    const ts = new Date().toLocaleTimeString('en-US', { hour12: false });
    const entry = document.createElement('div');
    entry.className = 'log-entry new';
    entry.innerHTML = `<span class="log-ts">${ts}</span><span class="log-ic">${icon}</span><span class="log-tl">${title}</span><span class="log-dt">${detail}</span>`;
    container.appendChild(entry);
    container.scrollTop = container.scrollHeight;
    setTimeout(() => entry.classList.remove('new'), 600);
  }

  clearLog() { document.getElementById('exec-log').innerHTML = ''; }

  // ─── Timeline ───
  addTimeline(text) {
    const container = document.getElementById('timeline');
    const elapsed = this.timelineStart ? ((Date.now() - this.timelineStart) / 1000).toFixed(1) : '0.0';
    const entry = document.createElement('div');
    entry.className = 'tl-entry';
    entry.innerHTML = `<div class="tl-dot"></div><div><div class="tl-time">+${elapsed}s</div><div class="tl-text">${text}</div></div>`;
    container.appendChild(entry);
    container.scrollTop = container.scrollHeight;
  }

  clearTimeline() { document.getElementById('timeline').innerHTML = ''; }

  // ─── Rules ───
  addRule(stage, text, type) {
    const container = document.getElementById('rule-log');
    const entry = document.createElement('div');
    entry.className = `rule-entry rule-${type}`;
    entry.innerHTML = `<div class="rule-stage">${stage}</div><div class="rule-text">${text}</div>`;
    container.appendChild(entry);
    container.scrollTop = container.scrollHeight;
  }

  clearRules() { document.getElementById('rule-log').innerHTML = ''; }

  // ─── Analytics ───
  updateAnalytics() {
    const a = this.engine.getAnalytics();
    this.animateCounter('stat-total', a.totalSimulations);
    this.animateCounter('stat-approved', a.approved);
    this.animateCounter('stat-rejected', a.rejected);
    const rate = a.totalSimulations > 0 ? Math.round((a.approved / a.totalSimulations) * 100) : 0;
    document.getElementById('stat-rate').textContent = rate + '%';
    this.animateCounter('stat-high', a.highRisk);
    this.animateCounter('stat-medium', a.mediumRisk);
    this.animateCounter('stat-low', a.lowRisk);
  }

  animateCounter(id, target) {
    const el = document.getElementById(id);
    const current = parseInt(el.textContent) || 0;
    if (current === target) return;
    let start = current;
    const step = target > current ? 1 : -1;
    const interval = setInterval(() => {
      start += step;
      el.textContent = start;
      if (start === target) clearInterval(interval);
    }, 60);
  }
}
