# # it_change_management/setup/config.py

# # ==============================================================================
# # Central Configuration for the IT Change Management Module
# # ==============================================================================
# # This file contains all the constant names and lists used across the
# # installation, uninstallation, and definition files. Modifying a name or
# # list here will automatically update it for all related processes.
# # ==============================================================================

# # --- Primary Names ---
# MODULE_NAME = "IT Change Management"
# APP_NAME = "it_change_management"  # The internal name of the app folder
# WORKFLOW_NAME = "IT Change Management Workflow"


# # --- Custom Roles ---
# # This list is used to create the roles during installation and to find
# # and delete them during uninstallation.
# CUSTOM_ROLES = [
#     "Requester",
#     "Requester Manager",
#     "Requester's Group Manager",
#     "Relationship Manager",
#     "Business Solution Team Member",
#     "CAC Member",
#     "Development Team Manager",
#     "Deployer",
#     "IT Assurance Manager",
#     "IT Assurance Team",
#     "Infrastructure Manager",
#     "ITGC Manager",
#     "Infrastructure Team",
# ]

# # --- Workflow Metadata ---
# # These lists are used by the uninstaller to ensure a complete cleanup
# # of the Workflow State and Workflow Action Master records, which are
# # created by the installer.

# WORKFLOW_STATES = [
#     "Not Started",
#     "Open",
#     "CAC Review",
#     "Assigning",
#     "Under Development",
#     "System Integration Testing (SIT)",
#     "User Acceptance Testing (UAT)",
#     "Deployment Preparation",
#     "Deployment",
#     "Post Implementation Review (PIR)",
#     "Closure",
#     "Planning",
#     "Approvals",
#     "Implementation",
#     "Review and Close",
#     "Closed",
#     "Rejected",
# ]

# WORKFLOW_ACTIONS = [
#     "Assign RM",
#     "Submit for Review",
#     "Approve",
#     "Reject",
#     "Confirm Plan",
#     "Move to SIT",
#     "Move to UAT",
#     "Approve UAT",
#     "Ready for Deployment",
#     "Log Deployment Complete",
#     "Initiate Close",
#     "Confirm Close",
#     "Open CR",
#     "Start Planning",
#     "Submit for Approval",
#     "Complete Implementation",
#     "Close CR",
#     "Reopen",
# ]
# it_change_management/setup/config.py

# ==============================================================================
# Central Configuration for the IT Change Management Module
# ==============================================================================
# This file contains all the constant names and configurations used across the
# installation, uninstallation, and definition files. It is structured to
# support multiple workflows for different DocTypes.
# ==============================================================================

# --- Import Workflow Definitions ---
# All definition functions are now imported from the single workflow_def.py file.
from .definitions.workflow_def import (
    get_cr_workflow_states, get_cr_workflow_transitions,
    get_deployment_plan_workflow_states, get_deployment_plan_workflow_transitions,
    get_task_workflow_states, get_task_workflow_transitions
)

# --- Primary Names ---
MODULE_NAME = "IT Change Management"
APP_NAME = "it_change_management"

# --- Master List of Custom Roles ---
# This single list is used to create all required roles during installation
# and to find and delete them during uninstallation.
CUSTOM_ROLES = [
    "Requester",
    "Requester Manager",
    "Requester's Group Manager",
    "Relationship Manager",
    "Business Solution Team Member",
    "CAC Member",
    "Development Team Manager",
    "Deployer",
    "IT Assurance Manager",
    "IT Assurance Team",
    "Infrastructure Manager",
    "ITGC Manager",
    "Infrastructure Team",
]

# ==============================================================================
# WORKFLOW CONFIGURATION DICTIONARY
# ==============================================================================
# This is the central registry for all workflows in the module.
# The installer script iterates through this dictionary to create each workflow.
# To add a new workflow:
# 1. Define its get_..._states/transitions functions in workflow_def.py.
# 2. Import those functions at the top of this file.
# 3. Add its configuration block to this dictionary.
# ==============================================================================
WORKFLOW_CONFIGS = {
    "Change Request": {
        "workflow_name": "IT Change Management Workflow",
        "doctype": "Change Request",
        "state_field": "status",
        "get_states": get_cr_workflow_states,
        "get_transitions": get_cr_workflow_transitions,
    }
}

# --- Dynamic Metadata for Uninstaller ---
# These lists are generated automatically from WORKFLOW_CONFIGS. The uninstaller
# uses them to ensure a complete cleanup of all created Workflow States/Actions.
def _get_all_unique_values(key, sub_key):
    """Helper to extract unique state or action names from all workflow configs."""
    all_values = set()
    for config in WORKFLOW_CONFIGS.values():
        if key == 'transitions':
            items = config['get_transitions']()
        elif key == 'states':
            items = config['get_states']()
        else:
            items = []
            
        for item in items:
            all_values.add(item[sub_key])
    return list(all_values)

ALL_WORKFLOW_STATES = _get_all_unique_values('states', 'state')
ALL_WORKFLOW_ACTIONS = _get_all_unique_values('transitions', 'action')