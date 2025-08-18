# # it_change_management/setup/definitions/workflow_def.py

# # ==============================================================================
# # Inconsistency Check 1: Role Names
# # ==============================================================================
# # I will cross-reference these roles with your config.py.
# # "Requester's Group Manager" -> OK
# # "Relationship Manager" -> OK
# # "CAC Member" -> OK
# # "Development Team Manager" -> OK
# # "Business Solution Team Member" -> OK
# # "Requester" -> OK
# # "IT Assurance Team" -> OK
# # "Deployer" -> OK
# # "Infrastructure Manager" -> OK
# # "Infrastructure Team" -> OK
# # "System Manager" -> OK (Standard Role)
# #
# # Finding: All role names used here are consistent with your config.py. This is excellent.

# def get_workflow_states():
#     """
#     Returns the list of states for the workflow.
#     """
#     return[
#         {"state": "Draft", "doc_status": 0, "allow_edit": "All"},
#         {"state": "Manager Review", "doc_status": 0, "allow_edit": "Requester Manager"},
#         {"state": "Not Started", "doc_status": 0, "allow_edit": "Requester's Group Manager"},
#         {"state": "Open", "doc_status": 0, "allow_edit": "Relationship Manager"},
#         {"state": "CAC Review", "doc_status": 0, "allow_edit": "CAC Member"},
#         {"state": "Assigning", "doc_status": 0, "allow_edit": "Development Team Manager"},
#         {"state": "Under Development", "doc_status": 0, "allow_edit": "Business Solution Team Member"},
#         {"state": "System Integration Testing (SIT)", "doc_status": 0, "allow_edit": "Business Solution Team Member"},
#         {"state": "User Acceptance Testing (UAT)", "doc_status": 0, "allow_edit": "Requester"},
#         {"state": "Deployment Preparation", "doc_status": 0, "allow_edit": "IT Assurance Team"},
#         {"state": "Deployment", "doc_status": 0, "allow_edit": "Deployer"},
#         {"state": "Post Implementation Review (PIR)", "doc_status": 0, "allow_edit": "Relationship Manager"},
#         {"state": "Closure", "doc_status": 0, "allow_edit": "Relationship Manager"},
#         {"state": "Planning", "doc_status": 0, "allow_edit": "Infrastructure Manager"},
#         {"state": "Approvals", "doc_status": 0, "allow_edit": "Infrastructure Manager"},
#         {"state": "Implementation", "doc_status": 0, "allow_edit": "Infrastructure Team"},
#         {"state": "Review and Close", "doc_status": 0, "allow_edit": "Infrastructure Manager"},
        
#         # ==============================================================================
#         # Sanity Check 1: Doc Status
#         # ==============================================================================
#         # These are your terminal states. It's good practice that only one state
#         # corresponds to doc_status: 1 (Submitted/Closed) and one to doc_status: 2 (Cancelled/Rejected).
#         # You have this correct.
#         {"state": "Closed", "doc_status": 1, "allow_edit": "System Manager", "style": "Success"},
#         {"state": "Rejected", "doc_status": 2, "allow_edit": "System Manager", "style": "Danger"}
#     ]

# def get_workflow_transitions():
#     # ==============================================================================
#     # Inconsistency Check 2: State Names
#     # ==============================================================================
#     # I will verify that every 'state' and 'next_state' exists in the list from get_workflow_states().
#     # "Not Started" -> OK
#     # "Open" -> OK
#     # "CAC Review" -> OK
#     # "Assigning" -> OK
#     # "Under Development" -> OK
#     # "System Integration Testing (SIT)" -> OK
#     # "User Acceptance Testing (UAT)" -> OK
#     # "Deployment Preparation" -> OK
#     # "Deployment" -> OK
#     # "Post Implementation Review (PIR)" -> OK
#     # "Closure" -> OK
#     # "Closed" -> OK
#     # "Planning" -> OK
#     # "Approvals" -> OK
#     # "Implementation" -> OK
#     # "Review and Close" -> OK
#     # "Rejected" -> OK
#     #
#     # Finding: All state names used in transitions are valid and defined above. This is also excellent.

#     return [
#         {
#             "state": "Draft",
#             "action": "Submit for Review",
#             "next_state": "Manager Review",
#             "allowed": "All"
#         },
#         {
#             "state": "Manager Review",
#             "action": "Approve",
#             "next_state": "Not Started",
#             "allowed": "Requester Manager"
#         },
#         # --- THIS IS THE MODIFIED TRANSITION ---
#         {
#             "state": "Manager Review",
#             "action": "Reject",
#             # If the manager rejects, the CR is now moved to the final "Rejected" state.
#             "next_state": "Closed",
#             "allowed": "Requester Manager"
#         },
#         {"state": "Not Started", "action": "Assign RM", "next_state": "Open", "allowed": "Requester's Group Manager", "condition": "doc.cr_type == 'Business Change'"},
#         {"state": "Open", "action": "Submit for Review", "next_state": "CAC Review", "allowed": "Relationship Manager", "condition": "doc.cr_type == 'Business Change'"},
#         {"state": "CAC Review", "action": "Approve", "next_state": "Assigning", "allowed": "CAC Member"},
#         {"state": "CAC Review", "action": "Reject", "next_state": "Open", "allowed": "CAC Member"},
#         {"state": "Assigning", "action": "Confirm Plan", "next_state": "Under Development", "allowed": "Development Team Manager"},
#         {"state": "Under Development", "action": "Move to SIT", "next_state": "System Integration Testing (SIT)", "allowed": "Development Team Manager"},
#         {"state": "System Integration Testing (SIT)", "action": "Move to UAT", "next_state": "User Acceptance Testing (UAT)", "allowed": "Development Team Manager"},
#         {"state": "User Acceptance Testing (UAT)", "action": "Approve UAT", "next_state": "Deployment Preparation", "allowed": "Requester"},
#         {"state": "Deployment Preparation", "action": "Ready for Deployment", "next_state": "Deployment", "allowed": "IT Assurance Team"},
#         {"state": "Deployment", "action": "Log Deployment Complete", "next_state": "Post Implementation Review (PIR)", "allowed": "Deployer"},
#         {"state": "Post Implementation Review (PIR)", "action": "Initiate Close", "next_state": "Closure", "allowed": "Relationship Manager"},
#         {"state": "Closure", "action": "Confirm Close", "next_state": "Closed", "allowed": "Relationship Manager"},
        
#         # --- Infrastructure Standard Change Transitions ---
#         {"state": "Not Started", "action": "Open CR", "next_state": "Open", "allowed": "Infrastructure Manager", "condition": "doc.cr_type == 'Infrastructure Standard Change'"},
#         {"state": "Open", "action": "Start Planning", "next_state": "Planning", "allowed": "Infrastructure Manager", "condition": "doc.cr_type == 'Infrastructure Standard Change'"},
#         {"state": "Planning", "action": "Submit for Approval", "next_state": "Approvals", "allowed": "Infrastructure Manager", "condition": "doc.cr_type == 'Infrastructure Standard Change'"},
        
#         # ==============================================================================
#         # Logic and Structure Check: Multiple approvers for the same action
#         # ==============================================================================
#         # This is the most critical part of your definition. You have two "Approve"
#         # transitions from the "Approvals" state, one for 'IT Assurance Manager' and
#         # one for 'ITGC Manager'.
#         #
#         # How Frappe Handles This: When a user from EITHER of these roles clicks the
#         # "Approve" button, the workflow will move to the "Implementation" state.
#         # This means you do NOT need both to approve. It's an "OR" condition.
#         # Your current structure is perfectly valid for this "any one can approve" logic.
#         #
#         # If you needed BOTH to approve, you would need a more complex setup with
#         # intermediate states (e.g., "Awaiting ITGC Approval" -> "Awaiting IT Assurance Approval").
#         #
#         # Finding: Your implementation is correct for an "OR" approval process. No changes needed.
#         {"state": "Approvals", "action": "Approve", "next_state": "Implementation", "allowed": "IT Assurance Manager", "condition": "doc.cr_type == 'Infrastructure Standard Change'"},
#         {"state": "Approvals", "action": "Approve", "next_state": "Implementation", "allowed": "ITGC Manager", "condition": "doc.cr_type == 'Infrastructure Standard Change'"},
        
#         # The same logic applies to rejection. Either manager can reject the CR. This is also correct.
#         {"state": "Approvals", "action": "Reject", "next_state": "Open", "allowed": "IT Assurance Manager", "condition": "doc.cr_type == 'Infrastructure Standard Change'"},
#         {"state": "Approvals", "action": "Reject", "next_state": "Open", "allowed": "ITGC Manager", "condition": "doc.cr_type == 'Infrastructure Standard Change'"},
        
#         {"state": "Implementation", "action": "Complete Implementation", "next_state": "Review and Close", "allowed": "Infrastructure Team", "condition": "doc.cr_type == 'Infrastructure Standard Change'"},
#         {"state": "Review and Close", "action": "Close CR", "next_state": "Closed", "allowed": "Infrastructure Manager", "condition": "doc.cr_type == 'Infrastructure Standard Change'"},
        
#         # --- Common Transitions ---
#         {"state": "Closed", "action": "Reopen", "next_state": "Rejected", "allowed": "System Manager"},
#     ]

# it_change_management/setup/workflow_def.py

# ==============================================================================
# Central Workflow Definitions for the IT Change Management Module
# ==============================================================================
# This file contains the state and transition definitions for ALL workflows
# used in this module. Each workflow has two dedicated functions: one for
# states and one for transitions.
# ==============================================================================


# ------------------------------------------------------------------------------
# --- 1. IT Change Request Workflow ---
# DocType: Change Request
# Description: This is the main parent workflow that orchestrates the entire
#              change process. It includes a specific state to await the
#              approval of its child Deployment Plan.
# ------------------------------------------------------------------------------

# it_change_management/setup/workflow_def.py

# ==============================================================================
# Central Workflow Definitions for the IT Change Management Module
# ==============================================================================
# This file contains the state and transition definitions for ALL workflows.
# NOTE: For development, 'allow_edit' is set to 'All' to simplify testing.
# ==============================================================================


# ------------------------------------------------------------------------------
# --- 1. IT Change Request Workflow ---
# DocType: Change Request
# ------------------------------------------------------------------------------

def get_cr_workflow_states():
    """
    Returns the state dictionaries for the consolidated Change Request workflow.
    'allow_edit' is set to 'All' for all states for easier testing.
    """
    return [
        # Initial States
        {"state": "Draft", "doc_status": 0, "allow_edit": "All"},
        {"state": "Manager Review", "doc_status": 0, "allow_edit": "All"},
        
        # Core States (shared by both paths)
        {"state": "Not Started", "doc_status": 0, "allow_edit": "All"},
        {"state": "Open", "doc_status": 0, "allow_edit": "All"},

        # Business Change Path
        {"state": "CAC Review", "doc_status": 0, "allow_edit": "All"},
        {"state": "Assigning", "doc_status": 0, "allow_edit": "All"},
        {"state": "Under Development", "doc_status": 0, "allow_edit": "All"},
        {"state": "System Integration Testing (SIT)", "doc_status": 0, "allow_edit": "All"},
        {"state": "User Acceptance Testing (UAT)", "doc_status": 0, "allow_edit": "All"},
        {"state": "Deployment Preparation", "doc_status": 0, "allow_edit": "All"},
        {"state": "Deployment", "doc_status": 0, "allow_edit": "All"},
        {"state": "Post Implementation Review (PIR)", "doc_status": 0, "allow_edit": "All"},
        {"state": "Closure", "doc_status": 0, "allow_edit": "All"},

        # Infrastructure Change Path
        {"state": "Planning", "doc_status": 0, "allow_edit": "All"},
        {"state": "Approvals", "doc_status": 0, "allow_edit": "All"},
        {"state": "Implementation", "doc_status": 0, "allow_edit": "All"},
        {"state": "Review and Close", "doc_status": 0, "allow_edit": "All"},
        
        # Terminal States
        {"state": "Closed", "doc_status": 1, "allow_edit": "All"},
        {"state": "Rejected", "doc_status": 2, "allow_edit": "All"},
    ]

def get_cr_workflow_transitions():
    """Returns the transition dictionaries for the Change Request workflow."""
    return [
        # --- Initial Submission ---
        {"state": "Draft", "action": "Submit for Review", "next_state": "Manager Review", "allowed": "Requester"},
        
        # --- Manager Review ---
        {"state": "Manager Review", "action": "Approve", "next_state": "Not Started", "allowed": "Requester Manager"},
        {"state": "Manager Review", "action": "Reject", "next_state": "Rejected", "allowed": "Requester Manager"},

        # --- Business Change Path ---
        {"state": "Not Started", "action": "Assign RM", "next_state": "Open", "allowed": "Requester's Group Manager", "condition": "doc.cr_type == 'Business Change'"},
        {"state": "Open", "action": "Submit for Review", "next_state": "CAC Review", "allowed": "Relationship Manager", "condition": "doc.cr_type == 'Business Change'"},
        {"state": "CAC Review", "action": "Approve", "next_state": "Assigning", "allowed": "CAC Member"},
        {"state": "CAC Review", "action": "Reject", "next_state": "Rejected", "allowed": "CAC Member"},
        {"state": "Assigning", "action": "Confirm Plan", "next_state": "Under Development", "allowed": "Development Team Manager"},
        {"state": "Under Development", "action": "Move to SIT", "next_state": "System Integration Testing (SIT)", "allowed": "Development Team Manager"},
        {"state": "System Integration Testing (SIT)", "action": "Move to UAT", "next_state": "User Acceptance Testing (UAT)", "allowed": "IT Assurance Team"},
        {"state": "User Acceptance Testing (UAT)", "action": "Approve UAT", "next_state": "Deployment Preparation", "allowed": "Requester Manager"},
        {"state": "Deployment Preparation", "action": "Ready for Deployment", "next_state": "Deployment", "allowed": "Deployer"},
        {"state": "Deployment", "action": "Log Deployment Complete", "next_state": "Post Implementation Review (PIR)", "allowed": "Deployer"},
        {"state": "Post Implementation Review (PIR)", "action": "Initiate Close", "next_state": "Closure", "allowed": "Relationship Manager"},
        {"state": "Closure", "action": "Confirm Close", "next_state": "Closed", "allowed": "ITGC Manager"},
        
        # --- Infrastructure Standard Change Path ---
        {"state": "Not Started", "action": "Open CR", "next_state": "Planning", "allowed": "Infrastructure Manager", "condition": "doc.cr_type == 'Infrastructure Standard Change'"},
        {"state": "Planning", "action": "Submit for Approval", "next_state": "Approvals", "allowed": "Infrastructure Manager", "condition": "doc.cr_type == 'Infrastructure Standard Change'"},
        {"state": "Approvals", "action": "Approve", "next_state": "Implementation", "allowed": "IT Assurance Manager", "condition": "doc.cr_type == 'Infrastructure Standard Change'"},
        {"state": "Approvals", "action": "Approve", "next_state": "Implementation", "allowed": "ITGC Manager", "condition": "doc.cr_type == 'Infrastructure Standard Change'"},
        {"state": "Approvals", "action": "Reject", "next_state": "Rejected", "allowed": "IT Assurance Manager", "condition": "doc.cr_type == 'Infrastructure Standard Change'"},
        {"state": "Approvals", "action": "Reject", "next_state": "Rejected", "allowed": "ITGC Manager", "condition": "doc.cr_type == 'Infrastructure Standard Change'"},
        {"state": "Implementation", "action": "Complete Implementation", "next_state": "Review and Close", "allowed": "Infrastructure Team", "condition": "doc.cr_type == 'Infrastructure Standard Change'"},
        {"state": "Review and Close", "action": "Close CR", "next_state": "Closed", "allowed": "Infrastructure Manager", "condition": "doc.cr_type == 'Infrastructure Standard Change'"},
        
        # --- Common Reopen Transition ---
        {"state": "Closed", "action": "Reopen", "next_state": "Draft", "allowed": "System Manager"},
        {"state": "Rejected", "action": "Reopen", "next_state": "Draft", "allowed": "System Manager"},
    ]


# ------------------------------------------------------------------------------
# --- 2. IT Deployment Plan Workflow ---
# DocType: IT Change Deployement
# ------------------------------------------------------------------------------

def get_deployment_plan_workflow_states():
    """Returns the state dictionaries for the IT Deployment Plan workflow."""
    return [
        {"state": "Planning", "doc_status": 0, "allow_edit": "All"},
        {"state": "Submitted for Approval", "doc_status": 0, "allow_edit": "All"},
        {"state": "Approved", "doc_status": 1, "allow_edit": "All"},
        {"state": "Rejected", "doc_status": 2, "allow_edit": "All"},
    ]

def get_deployment_plan_workflow_transitions():
    """Returns the transition dictionaries for the IT Deployment Plan workflow."""
    return [
        {"state": "Planning", "action": "Submit for Approval", "next_state": "Submitted for Approval", "allowed": "Development Team Manager"},
        {"state": "Submitted for Approval", "action": "Approve", "next_state": "Approved", "allowed": "IT Assurance Manager"},
        {"state": "Submitted for Approval", "action": "Reject", "next_state": "Rejected", "allowed": "IT Assurance Manager"},
    ]

# ------------------------------------------------------------------------------
# --- 3. IT Change Task Workflow ---
# DocType: IT Change Task
# ------------------------------------------------------------------------------

def get_task_workflow_states():
    """Returns the state dictionaries for the IT Change Task workflow."""
    return [
        {"state": "Pending", "doc_status": 0, "allow_edit": "All"},
        {"state": "In Progress", "doc_status": 0, "allow_edit": "All"},
        {"state": "Completed", "doc_status": 1, "allow_edit": "All"},
        {"state": "Cancelled", "doc_status": 2, "allow_edit": "All"},
    ]

def get_task_workflow_transitions():
    """Returns the transition dictionaries for the IT Change Task workflow."""
    return [
        {"state": "Pending", "action": "Start Task", "next_state": "In Progress", "allowed": "All"},
        {"state": "In Progress", "action": "Mark as Completed", "next_state": "Completed", "allowed": "All"},
        {"state": "In Progress", "action": "Cancel Task", "next_state": "Cancelled", "allowed": "All"},
    ]