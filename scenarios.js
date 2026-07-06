// ============================================================
// scenarios.js — All 8 Scenarios with Narration
// ============================================================

const SCENARIOS = [
  // ── SCENARIO 1: Manager Review Path (Simple Approval) ──
  {
    id: 1,
    name: "Manager Review Path",
    badge: "Simple Approval",
    badgeColor: "#22c55e",
    themeColor: "#22c55e",
    themeGradient: "linear-gradient(135deg, #22c55e, #10b981)",
    icon: "👤",
    story: "An employee requests Read Access to the Financial Analytics Dashboard for quarterly reporting work. Since it is a standard business resource with low sensitivity, only the Manager's approval is required.",
    inputs: {
      employeeName: "Rahul Sharma",
      employeeType: "Full-Time",
      resourceName: "Financial Analytics Dashboard",
      accessType: "Read",
      criticalityLevel: "Low",
      numberOfDays: 30,
      businessJustification: "Need read access to Financial Analytics for Q4 quarterly reporting analysis."
    },
    decisionTableResult: "ManagerReview",
    decisionTableRow: 0,
    decisionTreeTriggered: false,
    decisionTreePath: [],
    riskLevel: null,
    approvers: [
      { role: "Manager", name: "Direct Manager", icon: "👤", status: "approved" }
    ],
    skippedApprovers: ["Resource Owner", "Security Team", "Compliance Team"],
    finalStatus: "approved",
    rejectionReason: null,
    totalSteps: 6,
    highlights: [
      "Decision Table Row #1: Financial Analytics → ManagerReview",
      "Decision Tree skipped — not needed for this route",
      "Fastest standard approval path"
    ],
    educationalNote: "Standard resources with low sensitivity only require Manager approval, keeping the process fast and efficient.",
    workflowSteps: [
      { id: "request", label: "Request Submitted", icon: "📋", status: "pending",
        narration: "Rahul Sharma submits a request for Read Access to the Financial Analytics Dashboard..." },
      { id: "validation", label: "Business Logic Validation", icon: "🔍", status: "pending",
        narration: "The system validates mandatory fields, checks for duplicates, verifies employee status, and evaluates the business justification..." },
      { id: "decisionTable", label: "Decision Table", icon: "📊", status: "pending",
        narration: "The Decision Table scans the resource name to determine the correct approval routing path..." },
      { id: "decisionTree", label: "Decision Tree", icon: "🌳", status: "skip",
        narration: "Decision Tree is not triggered — ManagerReview route doesn't require risk assessment.",
        skipReason: "Not triggered — ManagerReview route does not require risk assessment" },
      { id: "approval", label: "Manager Review", icon: "👤", status: "pending",
        narration: "The request is sent to the Direct Manager for approval. Manager reviews and approves the access request." },
      { id: "provisioning", label: "Provisioning", icon: "⚙️", status: "pending",
        narration: "Access is being provisioned in the system. Configuring read-level permissions for Financial Analytics Dashboard..." },
      { id: "verification", label: "Verification", icon: "✅", status: "pending",
        narration: "Employee confirms that access has been successfully granted and is working as expected." },
      { id: "closure", label: "Closure", icon: "📁", status: "pending",
        narration: "Case is closed. Audit log entry created. Access will expire after 30 days." }
    ],
    validationChecks: [
      { check: "Mandatory fields present", pass: true },
      { check: "No duplicate request", pass: true },
      { check: "Employee is active", pass: true },
      { check: "Business justification valid (≥ 20 chars)", pass: true },
      { check: "Policy compliance check", pass: true }
    ]
  },

  // ── SCENARIO 2: Resource Owner Review Path ──
  {
    id: 2,
    name: "Resource Owner Review Path",
    badge: "Owner Approval",
    badgeColor: "#3b82f6",
    themeColor: "#3b82f6",
    themeGradient: "linear-gradient(135deg, #3b82f6, #6366f1)",
    icon: "🏢",
    story: "An employee requests Write Access to the Inventory Management System to update stock records. Since the application belongs to the Warehouse Operations team, approval must come from the Resource Owner.",
    inputs: {
      employeeName: "Priya Verma",
      employeeType: "Full-Time",
      resourceName: "Inventory Management System",
      accessType: "Write",
      criticalityLevel: "Medium",
      numberOfDays: 60,
      businessJustification: "Need write access to update inventory records during month-end reconciliation."
    },
    decisionTableResult: "ResourceOwnerReview",
    decisionTableRow: 1,
    decisionTreeTriggered: false,
    decisionTreePath: [],
    riskLevel: null,
    approvers: [
      { role: "Resource Owner", name: "Warehouse Operations Head", icon: "🏢", status: "approved" }
    ],
    skippedApprovers: ["Manager", "Security Team", "Compliance Team"],
    finalStatus: "approved",
    rejectionReason: null,
    totalSteps: 6,
    highlights: [
      "Decision Table Row #2: Inventory Management → ResourceOwnerReview",
      "Different approver: Resource Owner instead of Manager",
      "Decision Tree skipped"
    ],
    educationalNote: "When a resource is owned by a specific team, the Resource Owner must approve access to ensure proper oversight.",
    workflowSteps: [
      { id: "request", label: "Request Submitted", icon: "📋", status: "pending",
        narration: "Priya Verma submits a request for Write Access to the Inventory Management System..." },
      { id: "validation", label: "Business Logic Validation", icon: "🔍", status: "pending",
        narration: "Validating request data — checking fields, duplicates, employee status, and justification..." },
      { id: "decisionTable", label: "Decision Table", icon: "📊", status: "pending",
        narration: "Decision Table identifies the resource owner — Inventory Management routes to ResourceOwnerReview..." },
      { id: "decisionTree", label: "Decision Tree", icon: "🌳", status: "skip",
        narration: "Decision Tree is not triggered — ResourceOwnerReview doesn't require risk assessment.",
        skipReason: "Not triggered — ResourceOwnerReview route does not require risk assessment" },
      { id: "approval", label: "Resource Owner Review", icon: "🏢", status: "pending",
        narration: "The Warehouse Operations Head reviews and approves the write access request." },
      { id: "provisioning", label: "Provisioning", icon: "⚙️", status: "pending",
        narration: "Provisioning write-level access to the Inventory Management System..." },
      { id: "verification", label: "Verification", icon: "✅", status: "pending",
        narration: "Priya confirms successful access to the system." },
      { id: "closure", label: "Closure", icon: "📁", status: "pending",
        narration: "Case closed. Audit trail recorded. Access valid for 60 days." }
    ],
    validationChecks: [
      { check: "Mandatory fields present", pass: true },
      { check: "No duplicate request", pass: true },
      { check: "Employee is active", pass: true },
      { check: "Business justification valid (≥ 20 chars)", pass: true },
      { check: "Policy compliance check", pass: true }
    ]
  },

  // ── SCENARIO 3: High-Risk Conditional Review (Most Complex) ──
  {
    id: 3,
    name: "High-Risk Conditional Review",
    badge: "Most Complex",
    badgeColor: "#ef4444",
    themeColor: "#ef4444",
    themeGradient: "linear-gradient(135deg, #ef4444, #dc2626)",
    icon: "🔴",
    story: "An IT administrator requires Admin-level access to the Customer Portal Application to configure security policies. This High Risk request requires dual approval from both Security and Compliance teams.",
    inputs: {
      employeeName: "Ayushi Shukla",
      employeeType: "Full-Time",
      resourceName: "Customer Portal Application",
      accessType: "Admin",
      criticalityLevel: "High",
      numberOfDays: 30,
      businessJustification: "Need admin access to configure security policies and user permissions on customer portal."
    },
    decisionTableResult: "ConditionalReview",
    decisionTableRow: 2,
    decisionTreeTriggered: true,
    decisionTreePath: [
      { question: "Q1: Is Access Type = Admin or Delete?", answer: "YES", result: "High" }
    ],
    riskLevel: "High",
    approvers: [
      { role: "Security Team", name: "Security Review Board", icon: "🛡️", status: "approved" },
      { role: "Compliance Team", name: "Compliance Officer", icon: "📜", status: "approved" }
    ],
    skippedApprovers: ["Manager", "Resource Owner"],
    finalStatus: "approved",
    rejectionReason: null,
    totalSteps: 8,
    highlights: [
      "Decision Table Row #3: Customer Portal → ConditionalReview",
      "Decision Tree triggered — Admin access = HIGH risk",
      "Double approval required: Security + Compliance"
    ],
    educationalNote: "Admin-level access to critical systems requires the highest scrutiny. Both Security and Compliance teams must review to prevent unauthorized privilege escalation.",
    workflowSteps: [
      { id: "request", label: "Request Submitted", icon: "📋", status: "pending",
        narration: "Ayushi Shukla submits a request for Admin Access to the Customer Portal Application..." },
      { id: "validation", label: "Business Logic Validation", icon: "🔍", status: "pending",
        narration: "Running all business logic validations — this is a high-criticality request requiring thorough checks..." },
      { id: "decisionTable", label: "Decision Table", icon: "📊", status: "pending",
        narration: "Decision Table routes Customer Portal Application to ConditionalReview — triggering risk assessment..." },
      { id: "decisionTree", label: "Decision Tree", icon: "🌳", status: "pending",
        narration: "⚠️ Decision Tree evaluates: Admin access detected! Immediately classified as HIGH RISK." },
      { id: "approval-security", label: "Security Team Review", icon: "🛡️", status: "pending",
        narration: "🛡️ Security Review Board examines the request for potential security implications... Approved." },
      { id: "approval-compliance", label: "Compliance Team Review", icon: "📜", status: "pending",
        narration: "📜 Compliance Officer verifies regulatory requirements are met... Approved." },
      { id: "provisioning", label: "Provisioning", icon: "⚙️", status: "pending",
        narration: "Provisioning admin-level access with enhanced audit logging enabled..." },
      { id: "verification", label: "Verification", icon: "✅", status: "pending",
        narration: "Access verified. Enhanced monitoring activated for admin-level permissions." },
      { id: "closure", label: "Closure", icon: "📁", status: "pending",
        narration: "Case closed with dual-approval audit trail. Admin access valid for 30 days with continuous monitoring." }
    ],
    validationChecks: [
      { check: "Mandatory fields present", pass: true },
      { check: "No duplicate request", pass: true },
      { check: "Employee is active", pass: true },
      { check: "Business justification valid (≥ 20 chars)", pass: true },
      { check: "Policy compliance check", pass: true }
    ]
  },

  // ── SCENARIO 4: Medium Risk (Compliance Review Only) ──
  {
    id: 4,
    name: "Medium Risk – Compliance Review",
    badge: "Compliance Only",
    badgeColor: "#f59e0b",
    themeColor: "#f59e0b",
    themeGradient: "linear-gradient(135deg, #f59e0b, #d97706)",
    icon: "🟡",
    story: "An analyst requests Write access to the Customer Portal Application to edit customer records. Not High Risk, but still requires Compliance Team approval for proper data governance.",
    inputs: {
      employeeName: "Amit Patel",
      employeeType: "Full-Time",
      resourceName: "Customer Portal Application",
      accessType: "Write",
      criticalityLevel: "Low",
      numberOfDays: 30,
      businessJustification: "Need write access to update customer contact information during onboarding."
    },
    decisionTableResult: "ConditionalReview",
    decisionTableRow: 2,
    decisionTreeTriggered: true,
    decisionTreePath: [
      { question: "Q1: Is Access Type = Admin or Delete?", answer: "NO", result: null },
      { question: "Q2: Is Criticality = High?", answer: "NO", result: null },
      { question: "Q3: Is Access = Modify AND Criticality = Medium?", answer: "NO", result: null },
      { question: "Q4: Is Number of Days > 90?", answer: "NO", result: null },
      { question: "Q5: Is Access = Write OR Modify?", answer: "YES", result: "Medium" }
    ],
    riskLevel: "Medium",
    approvers: [
      { role: "Compliance Team", name: "Compliance Officer", icon: "📜", status: "approved" }
    ],
    skippedApprovers: ["Manager", "Resource Owner", "Security Team"],
    finalStatus: "approved",
    rejectionReason: null,
    totalSteps: 7,
    highlights: [
      "All five Decision Tree questions evaluated",
      "Write access triggers Medium risk at Q5",
      "Only Compliance Team approval needed"
    ],
    educationalNote: "Write access to sensitive applications requires Compliance oversight even when other risk factors are low. The Decision Tree evaluates multiple conditions to determine the final risk level.",
    workflowSteps: [
      { id: "request", label: "Request Submitted", icon: "📋", status: "pending",
        narration: "Amit Patel submits a request for Write Access to the Customer Portal Application..." },
      { id: "validation", label: "Business Logic Validation", icon: "🔍", status: "pending",
        narration: "Running business logic validations — all checks passing..." },
      { id: "decisionTable", label: "Decision Table", icon: "📊", status: "pending",
        narration: "Customer Portal routes to ConditionalReview — Decision Tree will determine risk level..." },
      { id: "decisionTree", label: "Decision Tree", icon: "🌳", status: "pending",
        narration: "Decision Tree traversing all 5 questions... Write access detected at Q5 → MEDIUM Risk." },
      { id: "approval-compliance", label: "Compliance Team Review", icon: "📜", status: "pending",
        narration: "📜 Compliance Officer reviews the medium-risk write access request... Approved." },
      { id: "provisioning", label: "Provisioning", icon: "⚙️", status: "pending",
        narration: "Provisioning write access to Customer Portal Application..." },
      { id: "verification", label: "Verification", icon: "✅", status: "pending",
        narration: "Amit confirms access is working correctly." },
      { id: "closure", label: "Closure", icon: "📁", status: "pending",
        narration: "Case closed. Compliance-approved access valid for 30 days." }
    ],
    validationChecks: [
      { check: "Mandatory fields present", pass: true },
      { check: "No duplicate request", pass: true },
      { check: "Employee is active", pass: true },
      { check: "Business justification valid (≥ 20 chars)", pass: true },
      { check: "Policy compliance check", pass: true }
    ]
  },

  // ── SCENARIO 5: Low Risk (Auto-Approve) ──
  {
    id: 5,
    name: "Low Risk – Auto-Approve",
    badge: "Fast Track",
    badgeColor: "#22c55e",
    themeColor: "#22c55e",
    themeGradient: "linear-gradient(135deg, #22c55e, #10b981)",
    icon: "⚡",
    story: "An employee requests basic Read Access to the Customer Portal Application for viewing customer analytics reports. Low Risk qualifies for fast-track auto-approval.",
    inputs: {
      employeeName: "Sneha Iyer",
      employeeType: "Full-Time",
      resourceName: "Customer Portal Application",
      accessType: "Read",
      criticalityLevel: "Low",
      numberOfDays: 30,
      businessJustification: "Need read access to view customer analytics reports for market research."
    },
    decisionTableResult: "ConditionalReview",
    decisionTableRow: 2,
    decisionTreeTriggered: true,
    decisionTreePath: [
      { question: "Q1: Is Access Type = Admin or Delete?", answer: "NO", result: null },
      { question: "Q2: Is Criticality = High?", answer: "NO", result: null },
      { question: "Q3: Is Access = Modify AND Criticality = Medium?", answer: "NO", result: null },
      { question: "Q4: Is Number of Days > 90?", answer: "NO", result: null },
      { question: "Q5: Is Access = Write OR Modify?", answer: "NO", result: "Low" }
    ],
    riskLevel: "Low",
    approvers: [
      { role: "Auto-Approve", name: "System (Fast Track)", icon: "⚡", status: "approved" }
    ],
    skippedApprovers: ["Manager", "Security Team", "Compliance Team"],
    finalStatus: "approved",
    rejectionReason: null,
    totalSteps: 7,
    highlights: [
      "Decision Tree traverses all 5 questions → Low Risk",
      "Fast-track auto-approval path",
      "Fastest conditional review path"
    ],
    educationalNote: "Low-risk requests can be auto-approved, drastically reducing turnaround time. This is the fastest path through the ConditionalReview route.",
    workflowSteps: [
      { id: "request", label: "Request Submitted", icon: "📋", status: "pending",
        narration: "Sneha Iyer submits a request for Read Access to the Customer Portal Application..." },
      { id: "validation", label: "Business Logic Validation", icon: "🔍", status: "pending",
        narration: "All business logic validations pass successfully..." },
      { id: "decisionTable", label: "Decision Table", icon: "📊", status: "pending",
        narration: "Customer Portal routes to ConditionalReview — triggering the Decision Tree..." },
      { id: "decisionTree", label: "Decision Tree", icon: "🌳", status: "pending",
        narration: "Decision Tree evaluates all 5 questions — all answers NO → LOW Risk. Fast-track eligible!" },
      { id: "approval-auto", label: "Auto-Approve (Fast Track)", icon: "⚡", status: "pending",
        narration: "⚡ LOW RISK — System automatically approves the request. No human review needed!" },
      { id: "provisioning", label: "Provisioning", icon: "⚙️", status: "pending",
        narration: "Fast-track provisioning read access to Customer Portal..." },
      { id: "verification", label: "Verification", icon: "✅", status: "pending",
        narration: "Access verified and confirmed by the employee." },
      { id: "closure", label: "Closure", icon: "📁", status: "pending",
        narration: "Case closed via fast-track. Fastest approval path completed!" }
    ],
    validationChecks: [
      { check: "Mandatory fields present", pass: true },
      { check: "No duplicate request", pass: true },
      { check: "Employee is active", pass: true },
      { check: "Business justification valid (≥ 20 chars)", pass: true },
      { check: "Policy compliance check", pass: true }
    ]
  },

  // ── SCENARIO 6: Long Duration Edge Case (>90 Days) ──
  {
    id: 6,
    name: "Long Duration Edge Case",
    badge: "> 90 Days",
    badgeColor: "#f59e0b",
    themeColor: "#f59e0b",
    themeGradient: "linear-gradient(135deg, #f59e0b, #d97706)",
    icon: "⏳",
    story: "An employee requests Read Access to the Customer Portal for 120 days. Although basic access, the long duration alone increases the risk level to Medium.",
    inputs: {
      employeeName: "Karan Malhotra",
      employeeType: "Full-Time",
      resourceName: "Customer Portal Application",
      accessType: "Read",
      criticalityLevel: "Low",
      numberOfDays: 120,
      businessJustification: "Need extended read access for the entire duration of the customer migration project."
    },
    decisionTableResult: "ConditionalReview",
    decisionTableRow: 2,
    decisionTreeTriggered: true,
    decisionTreePath: [
      { question: "Q1: Is Access Type = Admin or Delete?", answer: "NO", result: null },
      { question: "Q2: Is Criticality = High?", answer: "NO", result: null },
      { question: "Q3: Is Access = Modify AND Criticality = Medium?", answer: "NO", result: null },
      { question: "Q4: Is Number of Days > 90?", answer: "YES", result: "Medium" }
    ],
    riskLevel: "Medium",
    approvers: [
      { role: "Compliance Team", name: "Compliance Officer", icon: "📜", status: "approved" }
    ],
    skippedApprovers: ["Manager", "Resource Owner", "Security Team"],
    finalStatus: "approved",
    rejectionReason: null,
    totalSteps: 7,
    highlights: [
      "Days > 90 Detected! Duration alone increases risk level",
      "Compare with Scenario 5: same inputs except 30 vs 120 days",
      "Duration is an independent risk factor"
    ],
    educationalNote: "See how duration alone affects the overall risk level. Even basic Read access becomes Medium Risk when requested for more than 90 days.",
    workflowSteps: [
      { id: "request", label: "Request Submitted", icon: "📋", status: "pending",
        narration: "Karan Malhotra submits a request for Read Access to the Customer Portal for 120 days..." },
      { id: "validation", label: "Business Logic Validation", icon: "🔍", status: "pending",
        narration: "All validations pass. Note: 120-day duration will be evaluated by the Decision Tree..." },
      { id: "decisionTable", label: "Decision Table", icon: "📊", status: "pending",
        narration: "Customer Portal routes to ConditionalReview — risk assessment required..." },
      { id: "decisionTree", label: "Decision Tree", icon: "🌳", status: "pending",
        narration: "⚠️ Q4: Days > 90? → YES! Duration alone upgrades risk from Low to MEDIUM." },
      { id: "approval-compliance", label: "Compliance Team Review", icon: "📜", status: "pending",
        narration: "📜 Compliance reviews the extended-duration request... Approved with monitoring." },
      { id: "provisioning", label: "Provisioning", icon: "⚙️", status: "pending",
        narration: "Provisioning read access for 120 days with periodic review flag..." },
      { id: "verification", label: "Verification", icon: "✅", status: "pending",
        narration: "Access verified. Periodic review scheduled for the extended access period." },
      { id: "closure", label: "Closure", icon: "📁", status: "pending",
        narration: "Case closed. Key takeaway: Duration alone can increase risk level!" }
    ],
    validationChecks: [
      { check: "Mandatory fields present", pass: true },
      { check: "No duplicate request", pass: true },
      { check: "Employee is active", pass: true },
      { check: "Business justification valid (≥ 20 chars)", pass: true },
      { check: "Policy compliance check", pass: true }
    ]
  },

  // ── SCENARIO 7: Rejected by Business Logic ──
  {
    id: 7,
    name: "Rejected – Validation Failure",
    badge: "Rejected",
    badgeColor: "#ef4444",
    themeColor: "#ef4444",
    themeGradient: "linear-gradient(135deg, #ef4444, #b91c1c)",
    icon: "❌",
    story: "An employee submits an access request with an insufficient business justification. The request is rejected during Business Logic Validation before any routing occurs.",
    inputs: {
      employeeName: "Deepak Rao",
      employeeType: "Full-Time",
      resourceName: "Financial Analytics Dashboard",
      accessType: "Read",
      criticalityLevel: "Low",
      numberOfDays: 30,
      businessJustification: "Need it"
    },
    decisionTableResult: null,
    decisionTableRow: null,
    decisionTreeTriggered: false,
    decisionTreePath: [],
    riskLevel: null,
    approvers: [],
    skippedApprovers: ["Manager", "Resource Owner", "Security Team", "Compliance Team"],
    finalStatus: "rejected",
    rejectionReason: "Business justification must contain at least 20 characters. Please provide a detailed justification.",
    totalSteps: 3,
    highlights: [
      "Validation fails at justification check",
      "Decision Table and Decision Tree never triggered",
      "Business Logic is the first line of defense"
    ],
    educationalNote: "Business Logic Validation is your first line of defense. It catches incomplete or invalid requests before any routing decisions are made.",
    workflowSteps: [
      { id: "request", label: "Request Submitted", icon: "📋", status: "pending",
        narration: "Deepak Rao submits a request for Read Access to Financial Analytics Dashboard..." },
      { id: "validation", label: "Business Logic Validation", icon: "🔍", status: "pending",
        narration: "🚨 Validation FAILED! Business justification \"Need it\" is only 7 characters — minimum 20 required." },
      { id: "decisionTable", label: "Decision Table", icon: "📊", status: "skip",
        narration: "Decision Table skipped — request failed validation.",
        skipReason: "Not triggered — request rejected during validation" },
      { id: "decisionTree", label: "Decision Tree", icon: "🌳", status: "skip",
        narration: "Decision Tree skipped — request failed validation.",
        skipReason: "Not triggered — request rejected during validation" },
      { id: "rejection", label: "Request Rejected", icon: "🚫", status: "pending",
        narration: "❌ REQUEST REJECTED. Reason: Insufficient business justification." },
      { id: "notification", label: "Notification Sent", icon: "📧", status: "pending",
        narration: "Notification sent to Deepak Rao: \"Please provide a detailed business justification.\"" },
      { id: "closure", label: "Case Closed", icon: "📁", status: "pending",
        narration: "Case closed as Rejected. Business Logic is the first line of defense." }
    ],
    validationChecks: [
      { check: "Mandatory fields present", pass: true },
      { check: "No duplicate request", pass: true },
      { check: "Employee is active", pass: true },
      { check: "Business justification valid (≥ 20 chars)", pass: false,
        failReason: "Justification \"Need it\" is only 7 characters (minimum 20 required)" },
      { check: "Policy compliance check", pass: null }
    ]
  },

  // ── SCENARIO 8: Policy Violation ──
  {
    id: 8,
    name: "Policy Violation – Intern Admin",
    badge: "Policy Violation",
    badgeColor: "#dc2626",
    themeColor: "#dc2626",
    themeGradient: "linear-gradient(135deg, #dc2626, #991b1b)",
    icon: "🚫",
    story: "An intern requests Admin Access to the Customer Portal. Company policy prohibits interns from requesting Admin-level privileges. Rejected immediately.",
    inputs: {
      employeeName: "Riya Kapoor",
      employeeType: "Intern",
      resourceName: "Customer Portal Application",
      accessType: "Admin",
      criticalityLevel: "High",
      numberOfDays: 30,
      businessJustification: "Need admin access to learn the system."
    },
    decisionTableResult: null,
    decisionTableRow: null,
    decisionTreeTriggered: false,
    decisionTreePath: [],
    riskLevel: null,
    approvers: [],
    skippedApprovers: ["Manager", "Resource Owner", "Security Team", "Compliance Team"],
    finalStatus: "rejected",
    rejectionReason: "Company Policy: Interns cannot request Admin-level access. Suggestion: Request Read or Write access instead.",
    totalSteps: 3,
    highlights: [
      "Policy violation detected immediately",
      "Interns cannot request Admin access",
      "Suggested alternative: Read or Write access"
    ],
    educationalNote: "Company policies are enforced at the Business Logic layer. This prevents unauthorized requests from entering the approval workflow.",
    workflowSteps: [
      { id: "request", label: "Request Submitted", icon: "📋", status: "pending",
        narration: "Riya Kapoor (Intern) submits a request for Admin Access to the Customer Portal..." },
      { id: "validation", label: "Business Logic Validation", icon: "🔍", status: "pending",
        narration: "🚨 POLICY VIOLATION! Company policy: Interns cannot request Admin-level access." },
      { id: "decisionTable", label: "Decision Table", icon: "📊", status: "skip",
        narration: "Decision Table skipped — policy violation detected.",
        skipReason: "Not triggered — policy violation detected" },
      { id: "decisionTree", label: "Decision Tree", icon: "🌳", status: "skip",
        narration: "Decision Tree skipped — policy violation detected.",
        skipReason: "Not triggered — policy violation detected" },
      { id: "rejection", label: "Request Rejected", icon: "🚫", status: "pending",
        narration: "🚫 REQUEST REJECTED — Policy Violation: Interns cannot request Admin access." },
      { id: "notification", label: "Notification Sent", icon: "📧", status: "pending",
        narration: "Notification sent: \"Request Read or Write access instead. Admin access requires Full-Time status.\"" },
      { id: "closure", label: "Case Closed", icon: "📁", status: "pending",
        narration: "Case closed as Policy Violation. Business Logic protects the organization." }
    ],
    validationChecks: [
      { check: "Mandatory fields present", pass: true },
      { check: "No duplicate request", pass: true },
      { check: "Employee is active", pass: true },
      { check: "Business justification valid (≥ 20 chars)", pass: true },
      { check: "Policy compliance check", pass: false,
        failReason: "Company policy: Interns cannot request Admin-level access" }
    ]
  }
];

const DECISION_TABLE = [
  { resource: "Financial Analytics Dashboard", routeTo: "ManagerReview" },
  { resource: "Inventory Management System", routeTo: "ResourceOwnerReview" },
  { resource: "Customer Portal Application", routeTo: "ConditionalReview" }
];
