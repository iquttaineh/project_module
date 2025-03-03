import frappe
from frappe.utils import add_months, flt, date_diff, add_days
from datetime import timedelta
import base64
from frappe.utils.file_manager import save_file


@frappe.whitelist()
def get_project_data(project):
    # Fetch the Project and Project Charter documents using the dynamic values
    project_doc = frappe.get_doc("Project", project)
    # Ensure project_charter exists before attempting to fetch it
    if project_doc.project_charter:
        project_charter = frappe.get_doc("Project", project_doc.project_charter)
    else:
        project_charter = None  # or handle accordingly
    project_charter_doc = frappe.get_doc("Project Charter", project_charter)

    # Render a Jinja template and pass the fetched documents
    html_content = frappe.render_template("erpnext/templates/pages/MyPage/wsr.html", {
        "project": project_doc,
        "project_charter": project_charter_doc
    })

    return html_content

@frappe.whitelist()
def get_work_left(projectname, filters=None):
    columns = [
        {"fieldname": "month_start", "label": "Month Start Date", "fieldtype": "Date", "width": 120},
        {"fieldname": "remaining_percentage", "label": "% Remaining", "fieldtype": "Float", "width": 120}
    ]

    # Retrieve the project start date
    project_start = frappe.db.get_value("Project", projectname, "expected_start_date")
    if not project_start:
        frappe.throw("Project start date not found.")
    
    # Use current date as the limit for months instead of project end date
    current_date = datetime.now().date()
    
    # Calculate total days and months up to the current date
    total_days = date_diff(current_date, project_start)
    total_months = (total_days // 30) + 1  # Approximation, assuming 30 days per month

    # Fetch task completion data for the project
    tasks = frappe.get_all("Task", filters={"project": projectname}, fields=["exp_end_date", "progress"])
    
    # Initialize total expected progress based on the number of tasks
    total_tasks = len(tasks)
    total_expected_progress = total_tasks * 100  # Assuming each task contributes 100%

    data = []
    cumulative_progress = 0  # To track total progress up to the current month

    # Add an entry for the first month with 100% remaining progress
    month_name = datetime.strftime(project_start, "%b %Y")  # Format for the first month
    data.append({
        "month_name": month_name,
        "remaining_percentage": 100
    })

    # Iterate through each month up to the current month
    for month in range(total_months):
        month_start = add_months(project_start, month)  # Start of the current month
        month_end = add_months(month_start, 1)  # End of the current month

        # Calculate monthly progress
        monthly_progress = 0
        
        for task in tasks:
            # Check if the task should have been completed by this month
            if task.exp_end_date and month_start <= task.exp_end_date < month_end:
                monthly_progress += flt(task.progress)

        # Update cumulative progress
        cumulative_progress += monthly_progress
        
        # Calculate remaining percentage for the project
        if total_expected_progress > 0:
            remaining_percentage = max(0, (total_expected_progress - cumulative_progress) / total_expected_progress * 100)
        else:
            remaining_percentage = 0  # No tasks means no remaining percentage

        # Clamp the value between 0 and 100
        remaining_percentage = max(0, min(remaining_percentage, 100))

        # Format month name
        month_name = datetime.strftime(month_start, "%b %Y")

        # Append monthly remaining data
        data.append({
            "month_name": month_name,
            "remaining_percentage": remaining_percentage
        })

        # Stop if we've reached the current month
        if month_start >= current_date:
            break

    return data


@frappe.whitelist()
def get_status_options():
    """
    Fetches the task status options from the DocField for the Task doctype.
    """
    query = """
        SELECT options
        FROM `tabDocField`
        WHERE parent = 'Task' AND fieldname = 'status'
    """
    result = frappe.db.sql(query, as_dict=True)

    # Check if result is not empty and options exist
    if result and result[0].options:
        # Split options into a list and return
        return result[0].options.split("\n")  
    return []  # Return an empty list if no options found


@frappe.whitelist()
def get_status_counts(projectname):
    """
    Retrieves the count of tasks for each status.
    """
    # Get the task statuses
    status_options = get_status_options()  # Ensure this method returns a list of status names

    # Prepare a dictionary to hold counts for each status
    counts = {status: 0 for status in status_options}

    # Query to count tasks by status
    if status_options:
        # Use placeholders for safe query
        status_placeholders = ', '.join(['%s'] * len(status_options))
        query = f"""
            SELECT status, COUNT(*) as count
            FROM `tabTask`
            WHERE status IN ({status_placeholders})
            AND project = %s
            GROUP BY status
        """

        # Add projectname as the last parameter in the tuple
        params = tuple(status_options) + (projectname,)
        result = frappe.db.sql(query, params, as_dict=True)

        # Update counts based on the query results
        for row in result:
            counts[row['status']] = row['count']

    # Create a list of dictionaries with status and their respective counts
    return [{'status': status, 'count': counts[status]} for status in status_options]


@frappe.whitelist()
def get_task_counts_by_employee(projectname):
    """
    Retrieves the count of tasks assigned to each employee.
    """
    # Prepare the query to count tasks by employee (resource)
    query = """
        SELECT u.first_name AS employee, COUNT(*) AS count
        FROM `tabTask` t
        JOIN `tabUser` u ON JSON_CONTAINS(t._assign, CONCAT('"', u.email, '"'))
        WHERE t._assign IS NOT NULL
        AND t.project = %s
        GROUP BY u.first_name
    """
    
    # Execute the query and fetch the result
    result = frappe.db.sql(query, (projectname,), as_dict=True)

    # Return the result as a list of dictionaries with employee and their respective task counts
    return [{'employee': row['employee'], 'count': row['count']} for row in result]


@frappe.whitelist()
def upload_file(file_name, file_content, subject, message):
    try:
        # Decode base64 content
        file_content = base64.b64decode(file_content)

        # Save the file in the 'public/files' directory
        file_doc = save_file(
            fname=file_name,             # File name
            content=file_content,        # Decoded binary content
            dt=None,                     # No associated doctype
            dn=None,                     # No associated document name
            folder="Home/Attachments",
            is_private=0                 # Public file
        )

        # Get the file URL
        file_url = file_doc.file_url

        # Open ERPNext email dialog with attachment
        return {
            "status": "success",
            "file_url": file_url,
            "file_id": file_doc.name,  # Return File ID
            "folder": "Home/Attachments",
            "subject": subject,
            "message": message
        }

    except Exception as e:
        frappe.log_error(f"File upload or attachment failed: {str(e)}")
        frappe.throw("Failed to upload or attach the file.")

