# # it_change_management/setup/creators/workflow.py
# import frappe
# from ..config import WORKFLOW_NAME, CUSTOM_ROLES
# from ..definitions.workflow_def import get_workflow_states, get_workflow_transitions

# def create_workflow():
#     """
#     Creates the complete workflow for Change Request, performing pre-flight checks
#     and using robust error handling.
#     """
#     print("\n--- Creating Final Workflow ---")
    
#     # Wrap the entire process in a try...except block for safety
#     try:
#         # 1. PRE-FLIGHT CHECKS: Validate dependencies before starting
#         # =========================================================
#         print("  - Performing pre-flight checks...")
        
#         # Check if the target DocType exists
#         target_doctype = "Change Request"
#         if not frappe.db.exists("DocType", target_doctype):
#             raise Exception(f"Prerequisite failed: DocType '{target_doctype}' does not exist. Please create it before running the workflow creator.")

#         # Check if all custom roles required by the workflow exist
#         for role in CUSTOM_ROLES:
#             if not frappe.db.exists("Role", role):
#                 raise Exception(f"Prerequisite failed: Role '{role}' does not exist. Please ensure all roles are created first.")
        
#         print("  - ✔️ All prerequisites passed.")

#         # 2. WORKFLOW CREATION
#         # ====================
#         if frappe.db.exists("Workflow", WORKFLOW_NAME):
#             print(f"✔️ Workflow '{WORKFLOW_NAME}' already exists. Skipping.")
#             return

#         states = get_workflow_states()
#         transitions = get_workflow_transitions()
#         state_names = [s['state'] for s in states]
#         action_names = list(set([t['action'] for t in transitions]))

#         # Create Workflow States and Actions first
#         _ensure_workflow_metadata_exists(state_names, action_names)

#         # Now, create the main workflow document
#         print(f"  - Creating Workflow DocType: '{WORKFLOW_NAME}'...")
#         workflow = frappe.new_doc("Workflow")
#         workflow.workflow_name = WORKFLOW_NAME
#         workflow.document_type = target_doctype
#         workflow.workflow_state_field = "status"
#         workflow.is_active = 1

#         for state_data in states:
#             workflow.append("states", state_data)
        
#         for trans_data in transitions:
#             workflow.append("transitions", trans_data)
        
#         # Insert the final workflow with ignore_permissions
#         workflow.insert(ignore_permissions=True)
#         print(f"✔️ Workflow '{WORKFLOW_NAME}' created successfully.")

#     except Exception as e:
#         # Catch any exception during the process, log it, and re-raise to stop the main installer
#         print(f"\n❌ FAILED to create workflow: {e}")
#         frappe.log_error(frappe.get_traceback(), f"Workflow Creation Failed for {WORKFLOW_NAME}")
#         raise # Stop the main install.py script from continuing

# def _ensure_workflow_metadata_exists(state_names, action_names):
#     """
#     Ensures that all required Workflow States and Actions exist in the database.
#     This function is wrapped in its own error handling.
#     """
#     try:
#         print("  - Ensuring Workflow States exist...")
#         for state_name in state_names:
#             if not frappe.db.exists("Workflow State", state_name):
#                 frappe.get_doc({
#                     "doctype": "Workflow State",
#                     "workflow_state_name": state_name
#                 }).insert(ignore_permissions=True)

#         print("  - Ensuring Workflow Actions exist...")
#         for action_name in action_names:
#             if not frappe.db.exists("Workflow Action Master", action_name):
#                 frappe.get_doc({
#                     "doctype": "Workflow Action Master",
#                     "workflow_action_name": action_name
#                 }).insert(ignore_permissions=True)
                
#     except Exception as e:
#         print(f"\n❌ FAILED to create prerequisite workflow metadata (States or Actions): {e}")
#         # Re-raise the exception to be caught by the main function's handler
#         raise

# it_change_management/setup/creators/workflow.py

import frappe
from ..config import WORKFLOW_CONFIGS, CUSTOM_ROLES

def create_all_workflows():
    """
    Main entry point called by the installer (e.g., install.py).
    It iterates through the WORKFLOW_CONFIGS dictionary from config.py and
    calls the creation function for each defined workflow.
    """
    print("\n--- Starting Workflow Creation Process ---")
    
    if not WORKFLOW_CONFIGS:
        print("  - No workflows defined in config.py. Skipping.")
        return

    # Loop through each key-value pair in the configuration dictionary
    for name, config in WORKFLOW_CONFIGS.items():
        print(f"\n>>> Processing Workflow for: '{name}'")
        # Pass the specific configuration for one workflow to the creator function
        _create_single_workflow(config)

    print("\n--- All Workflows Processed Successfully ---")


def _create_single_workflow(config):
    """
    Creates one complete workflow based on a provided configuration dictionary.
    This function performs all pre-flight checks and handles the creation of
    the workflow document and its related metadata (states and actions).

    Args:
        config (dict): A dictionary from WORKFLOW_CONFIGS containing all the
                       necessary data for one workflow (name, doctype, states, etc.).
    """
    workflow_name = config["workflow_name"]
    target_doctype = config["doctype"]

    # Wrap the entire process in a try...except block for safety.
    # If any workflow fails, the entire installation will stop.
    try:
        # 1. PRE-FLIGHT CHECKS: Validate dependencies before starting
        # =========================================================
        print(f"  - Performing pre-flight checks for '{workflow_name}'...")

        # Check if the target DocType for this workflow exists
        if not frappe.db.exists("DocType", target_doctype):
            raise Exception(f"Prerequisite failed: DocType '{target_doctype}' does not exist. Please ensure it is created before running the installer.")

        # Check if all custom roles required by the module exist
        # This check is slightly redundant per loop, but is cheap and safe.
        for role in CUSTOM_ROLES:
            if not frappe.db.exists("Role", role):
                raise Exception(f"Prerequisite failed: Role '{role}' does not exist. Please ensure all custom roles are created first.")
        
        print("  - ✔️ All prerequisites passed.")

        # 2. WORKFLOW CREATION
        # ====================
        if frappe.db.exists("Workflow", workflow_name):
            print(f"✔️ Workflow '{workflow_name}' already exists. Skipping creation.")
            return

        # Get the specific states and transitions for this workflow by calling the functions
        # referenced in the config dictionary.
        states = config['get_states']()
        transitions = config['get_transitions']()
        state_names = [s['state'] for s in states]
        action_names = list(set([t['action'] for t in transitions]))

        # Ensure the 'Workflow State' and 'Workflow Action Master' documents exist
        # before we try to link them in the new workflow.
        _ensure_workflow_metadata_exists(state_names, action_names)

        # Now, create the main workflow document in memory
        print(f"  - Assembling Workflow: '{workflow_name}' for DocType '{target_doctype}'...")
        workflow = frappe.new_doc("Workflow")
        workflow.workflow_name = workflow_name
        workflow.document_type = target_doctype
        workflow.workflow_state_field = config['state_field']
        workflow.is_active = 1

        # Append the states and transitions to the child tables in the workflow document
        for state_data in states:
            workflow.append("states", state_data)
        
        for trans_data in transitions:
            workflow.append("transitions", trans_data)
        
        # Insert the fully assembled workflow document into the database
        workflow.insert(ignore_permissions=True)
        print(f"✔️ Workflow '{workflow_name}' created successfully.")

    except Exception as e:
        # Catch any exception during the process, log it, and re-raise to stop the main installer
        print(f"\n❌ FAILED to create workflow '{workflow_name}': {e}")
        frappe.log_error(frappe.get_traceback(), f"Workflow Creation Failed for {workflow_name}")
        raise # Stop the main install.py script from continuing

def _ensure_workflow_metadata_exists(state_names, action_names):
    """
    Ensures that all required 'Workflow State' and 'Workflow Action Master'
    records exist in the database. If they don't, it creates them.
    This prevents errors when creating the main Workflow doc.
    """
    try:
        # --- Create Workflow States ---
        print("  - Ensuring Workflow States exist...")
        for state_name in state_names:
            if not frappe.db.exists("Workflow State", state_name):
                frappe.get_doc({
                    "doctype": "Workflow State",
                    "workflow_state_name": state_name
                }).insert(ignore_permissions=True)

        # --- Create Workflow Actions ---
        print("  - Ensuring Workflow Actions exist...")
        for action_name in action_names:
            if not frappe.db.exists("Workflow Action Master", action_name):
                frappe.get_doc({
                    "doctype": "Workflow Action Master",
                    "workflow_action_name": action_name
                }).insert(ignore_permissions=True)
                
    except Exception as e:
        # If metadata creation fails, it's a critical error.
        print(f"\n❌ FAILED to create prerequisite workflow metadata (States or Actions): {e}")
        # Re-raise the exception to be caught by the main function's handler
        raise

def _get_all_unique_values(key, sub_key):
    """
    Helper function to dynamically discover all unique state and action names
    from the central workflow configuration. This is the inverse of the creator's
    discovery process and is necessary for a complete cleanup.
    """
    all_values = set()
    for config in WORKFLOW_CONFIGS.values():
        # Get the list of state or transition dictionaries by calling the function
        if key == 'transitions':
            items = config['get_transitions']()
        elif key == 'states':
            items = config['get_states']()
        else:
            items = []
            
        # Extract the specific value (e.g., the state name) from each dictionary
        for item in items:
            all_values.add(item[sub_key])
            
    return list(all_values)

def delete_all_workflows_and_metadata():
    """
    Deletes all workflows defined in WORKFLOW_CONFIGS and their associated
    state and action metadata documents. The deletion happens in the correct
    order to prevent dependency errors.
    """
    print("\n--- Deleting Workflows and Associated Metadata ---")

    # --- Step 1: Delete the main Workflow documents ---
    # This must be done first to remove the links to the state/action metadata.
    for config in WORKFLOW_CONFIGS.values():
        workflow_name = config["workflow_name"]
        try:
            # ignore_missing=True prevents errors if the workflow was already deleted
            # force=True bypasses certain validation checks for a cleaner removal
            frappe.delete_doc("Workflow", workflow_name, ignore_missing=True, force=True)
            print(f" - Deleted Workflow: {workflow_name}")
        except Exception as e:
            # Log a warning but don't stop the uninstallation process
            print(f"⚠️  Warning: Could not delete Workflow '{workflow_name}'. Reason: {e}")

    # --- Step 2: Dynamically discover all states and actions to delete ---
    # This is critical for ensuring we delete everything the creator made.
    all_states_to_delete = _get_all_unique_values('states', 'state')
    all_actions_to_delete = _get_all_unique_values('transitions', 'action')

    # --- Step 3: Delete the Workflow Action Master records ---
    print("\n--- Deleting Workflow Actions ---")
    for action_name in all_actions_to_delete:
        try:
            frappe.delete_doc("Workflow Action Master", action_name, ignore_missing=True, force=True)
            print(f" - Deleted Workflow Action: {action_name}")
        except Exception as e:
            print(f"⚠️  Warning: Could not delete Workflow Action '{action_name}'. Reason: {e}")

    # --- Step 4: Delete the Workflow State records ---
    print("\n--- Deleting Workflow States ---")
    for state_name in all_states_to_delete:
        try:
            frappe.delete_doc("Workflow State", state_name, ignore_missing=True, force=True)
            print(f" - Deleted Workflow State: {state_name}")
        except Exception as e:
            print(f"⚠️  Warning: Could not delete Workflow State '{state_name}'. Reason: {e}")