Complete Scenario Guide for Live Workflow Simulator
Enterprise Access Governance – Live Workflow Simulator Scenarios
蚘蚓蚔蚕蚖蚗 The Simulator's Purpose
Build an interacƟve web-based simulator that visually demonstrates how an Enterprise Access
Governance workflow processes access requests through the following layers:
 Business Logic ValidaƟon (data checks)
 Decision Table (approver rouƟng)
 Decision Tree (risk assessment)
 Approval Workflow (Manager / Owner / Security / Compliance)
 Provisioning & Closure
The simulator should allow users to select a scenario, animate the case journey stage-by-stage,
and clearly display which rules were executed and why.
茬茭 The 7 Core Scenarios
Each scenario represents a unique workflow path. Together they cover 100% of the
applicaƟon's decision logic.
꾇 SCENARIO 1: Manager Review Path (Simple Approval)
귲귳귴귵귶귷 Story
An employee requests Read Access to the Financial AnalyƟcs Dashboard for quarterly reporƟng
work.
Since it is a standard business resource with low sensiƟvity, only the Manager's approval is
required.
긱긲긳긵 Inputs
Field Value
Employee Name Rahul Sharma
Resource Name Financial AnalyƟcs
Access Type Read
CriƟcality Level Low
Number of Days 30
Business
JusƟficaƟon
"Need read access to Financial AnalyƟcs for Q4 quarterly reporƟng
analysis."
膆껎껏 Workflow Path
1. 膆 Request SubmiƩed
2. 膆 Business Logic ValidaƟon (All validaƟons pass)
3. Decision Table
Resource = "Financial AnalyƟcs"
↓
Returns
ManagerReview
4. Manager Review Stage (Manager approves)
5. Provisioning
Access Granted
6. VerificaƟon
Employee confirms access
7. Closure
Audit log created
蚘蚓蚔蚕蚖蚗 Expected Output
Approval Flow
ManagerReview
Risk Assessment
Not Triggered
(Decision Tree skipped)
Approvers
Manager Only
Final Status
膆 Approved & Provisioned
Total Steps
6
골곩곪곫곬 Simulator Highlights
 Highlight Decision Table Row #1
 Financial AnalyƟcs → ManagerReview
 Skip Decision Tree animaƟon
 Show Green "Approved" badge
 Animate straight path from ValidaƟon → Manager → Provisioning
꾇 SCENARIO 2: Resource Owner Review Path
귲귳귴귵귶귷 Story
An employee requests Write Access to the Inventory Management System to update stock
records.
Since the applicaƟon belongs to the Warehouse OperaƟons team, approval must come from the
Resource Owner.
긱긲긳긵 Inputs
Field Value
Employee Name Priya Verma
Resource Name Inventory Management
Access Type Write
CriƟcality Level Medium
Number of Days 60
Business
JusƟficaƟon
"Need write access to update inventory records during month-end
reconciliaƟon."
膆껎껏 Workflow Path
1. 膆 Request SubmiƩed
2. 膆 Business Logic ValidaƟon
3. Decision Table
Resource = "Inventory Management"
↓
Returns
ResourceOwnerReview
4. Resource Owner Review Stage
Owner Approves
5. Provisioning
Access Granted
6. VerificaƟon
Employee Confirms
7. Closure
Audit Logged
蚘蚓蚔蚕蚖蚗 Expected Output
Approval Flow
ResourceOwnerReview
Risk Assessment
Not Triggered
Approvers
Resource Owner
(Warehouse OperaƟons Head)
Final Status
膆 Approved & Provisioned
Total Steps
6
골곩곪곫곬 Simulator Highlights
 Highlight Decision Table Row #2
 Inventory Management → ResourceOwnerReview
 Animate rouƟng arrow toward Resource Owner
 Display different approver icon (Owner instead of Manager)
 Skip Decision Tree
꾂 SCENARIO 3: High-Risk CondiƟonal Review (Most Complex)
귲귳귴귵귶귷 Story
An IT administrator requires Admin-level access to the Customer Portal ApplicaƟon to
configure security policies and user permissions.
Since this request is classified as High Risk, it requires approval from both the Security Team
and the Compliance Team before access can be provisioned.
긱긲긳긵 Inputs
Field Value
Employee Name Ayushi Shukla
Resource Name Customer Portal ApplicaƟon
Access Type Admin
CriƟcality Level High
Number of Days 30
Business
JusƟficaƟon
"Need admin access to configure security policies and user permissions on
customer portal."
膆껎껏 Workflow Path
1. 膆 Request SubmiƩed
2. 膆 Business Logic ValidaƟon
3. Decision Table
Resource = "Customer Portal"
↓
Returns
CondiƟonalReview
4. Decision Tree
Q1: Is Access Type = Admin or Delete?
↓
YES
↓
Return "High"
5. Security Team Review (Approves)
6. Compliance Team Review (Approves)
7. Provisioning
8. VerificaƟon
9. Closure 膆
蚘蚓蚔蚕蚖蚗 Expected Output
Approval Flow
CondiƟonalReview
Risk Level
꾂 High
Approvers
Security Team
+
Compliance Team
(Double Review)
Final Status
膆 Approved & Provisioned
Total Steps
8
골곩곪곫곬 Simulator Highlights
 Highlight Decision Table Row #3
 Customer Portal → CondiƟonalReview
 Animate Decision Tree traversal
Q1 → Is Access Type = Admin or Delete?
YES
↓
Return HIGH
 Show two approver boxes simultaneously
o Security Team
o Compliance Team
 Use Red theme throughout the workflow.
 Display addiƟonal audit trail entries.
밃 SCENARIO 4: Medium Risk (Compliance Review Only)
귲귳귴귵귶귷 Story
An analyst requests Write access to the Customer Portal ApplicaƟon to edit customer records.
The request is not High Risk, but it sƟll requires Compliance Team approval to ensure proper
data governance.
긱긲긳긵 Inputs
Field Value
Employee Name Amit Patel
Resource Name Customer Portal ApplicaƟon
Access Type Write
Field Value
CriƟcality Level Low
Number of Days 30
Business
JusƟficaƟon
"Need write access to update customer contact informaƟon during
onboarding."
膆껎껏 Workflow Path
1. 膆 Request SubmiƩed
2. 膆 Business Logic ValidaƟon
3. Decision Table
Resource = "Customer Portal"
↓
Returns
CondiƟonalReview
4. Decision Tree Traversal
Q1: Admin/Delete?
→ NO
Q2: CriƟcality = High?
→ NO
Q3: Modify AND Medium?
→ NO
Q4: Days > 90?
→ NO
Q5: Write OR Modify?
→ YES
Return "Medium"
5. Compliance Review (Approves)
6. Provisioning
7. VerificaƟon
8. Closure 膆
蚘蚓蚔蚕蚖蚗 Expected Output
Approval Flow
CondiƟonalReview
Risk Level
밃 Medium
Approvers
Compliance Team Only
Final Status
膆 Approved & Provisioned
Total Steps
7
골곩곪곫곬 Simulator Highlights
 Animate all five Decision Tree quesƟons.
 Use Amber/Yellow color theme.
 Only Compliance Team approval card becomes acƟve.
 Security Team card remains greyed out.
밄 SCENARIO 5: Low Risk (Auto-Approve / Owner Approval)
귲귳귴귵귶귷 Story
An employee requests basic Read Access to the Customer Portal ApplicaƟon for viewing
customer analyƟcs reports.
Since the request is Low Risk, it qualifies for a fast-track approval process.
긱긲긳긵 Inputs
Field Value
Employee Name Sneha Iyer
Resource Name Customer Portal ApplicaƟon
Access Type Read
CriƟcality Level Low
Number of Days 30
Business
JusƟficaƟon
"Need read access to view customer analyƟcs reports for market
research."
膆껎껏 Workflow Path
1. 膆 Request SubmiƩed
2. 膆 Business Logic ValidaƟon
3. Decision Table
Resource = "Customer Portal"
↓
Returns
CondiƟonalReview
4. Decision Tree Traversal
Q1: Admin/Delete?
→ NO
Q2: CriƟcality High?
→ NO
Q3: Modify + Medium?
→ NO
Q4: Days > 90?
→ NO
Q5: Write/Modify?
→ NO
Return "Low"
5. Auto-Approve / Owner Approval (Fast Track)
6. Provisioning
7. VerificaƟon
8. Closure 膆
蚘蚓蚔蚕蚖蚗 Expected Output
Approval Flow
CondiƟonalReview
Risk Level
밄 Low
Approvers
Auto-Approve
OR
Resource Owner (Single Click)
Final Status
膆 Approved & Provisioned
Total Steps
7 (Fastest CondiƟonal Path)
골곩곪곫곬 Simulator Highlights
 Decision Tree ends with Low Risk.
 Use Green theme.
 Skip Security and Compliance approvals (greyed out).
 Display a Fast Lane arrow directly to Provisioning.
 Highlight that this is the fastest approval path.
       SCENARIO 6: Long DuraƟon Edge Case (>90 Days)
귲귳귴귵귶귷 Story
An employee requests Read Access to the Customer Portal ApplicaƟon for an extended period
(120 days). Although the requested access is basic, the long duraƟon increases the overall risk,
making it a Medium Risk request.
긱긲긳긵 Inputs
Field Value
Employee Name Karan Malhotra
Resource Name Customer Portal ApplicaƟon
Access Type Read
CriƟcality Level Low
Number of Days 120
Business
JusƟficaƟon
"Need extended read access for the enƟre duraƟon of the customer
migraƟon project."
膆껎껏 Workflow Path
1. 膆 Request SubmiƩed
2. 膆 Business Logic ValidaƟon
3. Decision Table
Resource = "Customer Portal"
↓
Returns
CondiƟonalReview
4. Decision Tree Traversal
Q1: Admin/Delete?
→ NO
Q2: CriƟcality = High?
→ NO
Q3: Modify AND Medium?
→ NO
Q4: Days > 90?
→ YES
Return "Medium"
5. Compliance Review (Approves)
6. Provisioning
7. VerificaƟon
8. Closure 膆
蚘蚓蚔蚕蚖蚗 Expected Output
Approval Flow
CondiƟonalReview
Risk Level
밃 Medium
(Upgraded because of duraƟon)
Approvers
Compliance Team
Final Status
膆 Approved & Provisioned
Special Note
DuraƟon alone can increase the risk level even when all other request aƩributes are considered
low risk.
골곩곪곫곬 Simulator Highlights
 Display a "Days > 90 Detected!" alert when QuesƟon 4 evaluates to YES.
 Compare this scenario with Scenario 5 (same inputs except 30 days vs. 120 days).
 Include an educaƟonal note:
"See how duraƟon alone affects the overall risk level."
 SCENARIO 7: Rejected by Business Logic (ValidaƟon Failure)
귲귳귴귵귶귷 Story
An employee submits an access request but provides an insufficient business jusƟficaƟon. The
request is rejected during Business Logic ValidaƟon, before the Decision Table or Decision Tree
are executed.
긱긲긳긵 Inputs
Field Value
Employee Name Deepak Rao
Resource Name Financial AnalyƟcs
Access Type Read
CriƟcality Level Low
Number of Days 30
Business JusƟficaƟon "Need it" (Too Short)
膆껎껏 Workflow Path
1. 膆 Request SubmiƩed
2. Business Logic ValidaƟon
 膆 Mandatory fields present
 膆 No duplicate request
 膆 Employee is acƟve
  Business jusƟficaƟon too short (less than 20 characters)
3.  Request Rejected during ValidaƟon
4. NoƟficaƟon sent to employee
"Please provide a detailed business jusƟficaƟon."
5. Case Closed
Status = Rejected
蚘蚓蚔蚕蚖蚗 Expected Output
Business Logic Result
 FAILED
(JusƟficaƟon too short)
Decision Table
⏭ Not Triggered
Decision Tree
⏭ Not Triggered
Final Status
 Rejected
RejecƟon Reason
Business jusƟficaƟon must contain
at least 20 characters.
골곩곪곫곬 Simulator Highlights
 Animate each Business Logic validaƟon one aŌer another.
 Highlight the failed validaƟon in red.
 Stop workflow immediately aŌer validaƟon.
 Display a red rejecƟon banner with the rejecƟon reason.
 Show an educaƟonal note:
"Business Logic is your first line of defense."
료룍 BONUS SCENARIO 8: Policy ViolaƟon (Advanced)
귲귳귴귵귶귷 Story
An intern requests Admin Access to the Customer Portal ApplicaƟon.
According to company policy, interns are not allowed to request Admin-level privileges, so the
request is rejected immediately during Business Logic ValidaƟon.
긱긲긳긵 Inputs
Field Value
Employee Name Riya Kapoor
Employee Type Intern
Resource Name Customer Portal ApplicaƟon
Access Type Admin
CriƟcality Level High
Number of Days 30
Field Value
Business JusƟficaƟon "Need admin access to learn the system."
膆껎껏 Workflow Path
1. 膆 Request SubmiƩed
2. Business Logic ValidaƟon
 膆 Mandatory fields present
 膆 No duplicate request
 膆 Employee is acƟve
 膆 Business jusƟficaƟon valid
  Policy ViolaƟon: Interns cannot request Admin access
3.  Request Rejected
蚘蚓蚔蚕蚖蚗 Expected Output
Business Logic Result
 FAILED
(Policy ViolaƟon)
Decision Table
⏭ Not Triggered
Decision Tree
⏭ Not Triggered
Final Status
 Rejected
RejecƟon Reason
Company policy:
Interns cannot request
Admin-level access.
Suggested AcƟon
Request Read or Write access instead.
골곩곪곫곬 Simulator Highlights
 Highlight the exact policy rule that caused the rejecƟon.
 Display suggested alternaƟve acƟons.
 Demonstrate why Business Logic ValidaƟon is the first layer of security.
 Use a red policy violaƟon banner to emphasize the rejecƟon.
궬궨궭궮궯 MASTER SCENARIO COMPARISON TABLE
Scenari
o
Resource
Access
Type
Risk
Level
Decision Table Result
Decision
Tree
Result
Approver(s
)
Final
Outcome
Scenario
1
Financial
AnalyƟcs
Dashboard
Read Low ManagerReview
Not
Triggere
d
Manager
膆
Approve
d
Scenario
2
Inventory
Managemen
t System
Write
Mediu
m
ResourceOwnerRevie
w
Not
Triggere
d
Resource
Owner
膆
Approve
d
Scenario
3
Customer
Portal
ApplicaƟon
Admin High CondiƟonalReview High
Security +
Compliance
膆
Approve
d
Scenario
4
Customer
Portal
ApplicaƟon
Write
Mediu
m
CondiƟonalReview Medium
Compliance
Team
膆
Approve
d
Scenari
o
Resource
Access
Type
Risk
Level
Decision Table Result
Decision
Tree
Result
Approver(s
)
Final
Outcome
Scenario
5
Customer
Portal
ApplicaƟon
Read Low CondiƟonalReview Low
Auto
Approval /
Resource
Owner
膆
Approve
d
Scenario
6
Customer
Portal
ApplicaƟon
Read
(120
Days)
Mediu
m
CondiƟonalReview Medium
Compliance
Team
膆
Approve
d
Scenario
7
Financial
AnalyƟcs
Dashboard
Read N/A Not Triggered
Not
Triggere
d
None 
Rejected
Scenario
8
Customer
Portal
ApplicaƟon
Admin
(Intern
)
N/A Not Triggered
Not
Triggere
d
None

Policy
ViolaƟon
虞號虠虡虢 Simulator Visual Design Guide
념녑녒녓녔 Home Screen
The landing page should contain:
 ApplicaƟon Title
 Short descripƟon of the simulator
 "Select Scenario" dropdown
 Start SimulaƟon buƩon
 Reset SimulaƟon buƩon
 Theme Toggle (OpƟonal)
Example Layout:
------------------------------------------------------
 Enterprise Access Governance Workflow Simulator
 Select Scenario:
 [▼ Scenario 1]
[Start SimulaƟon]
 [Reset]
------------------------------------------------------
   Workflow Canvas
The center of the screen should display an animated workflow.
Request
 │
 ▼
ValidaƟon
 │
 ▼
Decision Table
 │
 ▼
Decision Tree
 │
 ▼
Approval
 │
 ▼
Provisioning
 │
 ▼
VerificaƟon
 │
 ▼
Closure
Each stage should:
 Highlight when acƟve
 Show loading animaƟon
 Display execuƟon status
 Show execuƟon Ɵme
 Display success or failure
虞號虠虡虢 Color Scheme
밄 Green
Used for:
 Success
 Approved
 Low Risk
 Completed Stages
밃 Yellow
Used for:
 Medium Risk
 Compliance Review
 Warning Messages
꾂 Red
Used for:
 High Risk
 ValidaƟon Failure
 Policy ViolaƟons
 RejecƟons
꾃 Blue
Used for:
 Running Process
 AcƟve Stage
 InformaƟon Panels
긶긷길긹긺긻 Suggested UI Components
NavigaƟon
 Header
 Sidebar
 Scenario Selector
 Workflow Canvas
Workflow Cards
Each stage should appear as a separate card.
Example:
┌─────────────────────────┐
│ Business ValidaƟon │
│ ✔ Passed │
│ Time: 0.4 sec │
└─────────────────────────┘
Decision Table Viewer
Display the Decision Table exactly as the applicaƟon evaluates it.
Example:
Resource Route To
Financial AnalyƟcs ManagerReview
Inventory Management ResourceOwnerReview
Customer Portal CondiƟonalReview
Highlight the matching row during execuƟon.
Decision Tree Viewer
Animate the traversal.
Example:
Q1
│
├── Yes → High
│
└── No
 │
 ▼
Q2
│
├── Yes → High
│
└── No
 │
 ▼
Q3
...
Each visited node should glow while the simulator executes.
Approval Dashboard
Display approvers as cards.
Example:
Manager
Status:
✔ Approved
Security Team
Status:
✔ Approved
Compliance Team
Status:
Pending...
Cards should change color aŌer approval.
Provisioning Screen
Display:
Provisioning Request...
██████████████
Access Granted
Include a progress bar animaƟon.
Audit Timeline
Display every acƟon in chronological order.
Example:
09:01
Request SubmiƩed
09:02
ValidaƟon Passed
09:03
Decision Table Executed
09:04
Manager Approved
09:05
Provisioned
09:06
Closed
뱅뱆뱇뱈뱉뱊뱋뱌 Prompt Template for Building the Simulator
Use the following prompt to generate the simulator with an AI coding assistant:
Build a modern web-based Enterprise Access Governance Workflow Simulator using React.js.
The simulator should allow users to select predefined workflow scenarios and animate the
complete case lifecycle.
Features:
• Business Logic ValidaƟon
• Decision Table execuƟon
• Decision Tree traversal
• Approval rouƟng
• Provisioning
• VerificaƟon
• Closure
• Timeline animaƟon
• Risk badges
• Progress indicators
• Scenario comparison
• Responsive UI
• Dark mode support
Use component-based architecture.
Add smooth animaƟons.
Display execuƟon logs.
Highlight acƟve workflow stages.
Include educaƟonal toolƟps explaining why each rouƟng decision occurred.
Use a professional enterprise dashboard design.
 AddiƟonal Simulator Features (Nice-to-Have)
궧궨궩 AnalyƟcs Dashboard
Display:
 Total SimulaƟons Run
 Average Processing Time
 Approval Rate
 RejecƟon Rate
 High-Risk Requests
 Medium-Risk Requests
 Low-Risk Requests
궬궨궭궮궯 ExecuƟon Metrics
Track:
 ValidaƟon Time
 Decision Table Time
 Decision Tree Time
 Approval Time
 Provisioning Time
 Total Workflow Time
껳껱껲 Rule ExplanaƟon Panel
Whenever a rule executes, explain why it was selected.
Example:
Decision Table:
Resource = Customer Portal
Matched Row 3
Returned:
CondiƟonalReview
굽굾굿궀긍긎긏긐긑 ExecuƟon Log
Display a live execuƟon log.
Example:
✔ Request SubmiƩed
✔ ValidaƟon Passed
✔ Decision Table Executed
✔ Decision Tree Returned Medium Risk
✔ Compliance Approved
✔ Provisioned
✔ Closed
膆껎껏 Reset & Replay
Allow users to:
 Replay the same scenario
 Pause the animaƟon
 Resume execuƟon
 Step through one stage at a Ɵme
 Switch scenarios without reloading the applicaƟon
蘃蘄蘅 EducaƟonal Mode
Provide explanaƟons for each workflow step.
Example:
Business Logic ValidaƟon ensures all required data is present and follows organizaƟonal policies
before any rouƟng decisions are made.
Decision Table determines the appropriate approval path based on the selected resource.
Decision Tree evaluates request aƩributes (access type, criƟcality, duraƟon) to calculate the risk
level.
Provisioning grants access aŌer all approvals are completed.