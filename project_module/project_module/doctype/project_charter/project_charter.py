# Copyright (c) 2024, Ishaq and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class ProjectCharter(Document):
    def on_update(self):
        for milestone in self.milestones:
            # Safely access fields
            project_title = self.project_title.strip() if self.project_title else None
            task_subject = milestone.milestones.strip() if milestone.milestones else None
            expected_end_date = milestone.estimated_completion_date

            if task_subject and expected_end_date:
                # Normalize and check if task exists
                existing_task = frappe.db.sql("""
					SELECT name 
					FROM `tabTask` 
					WHERE subject = %s 
					AND project = %s 
					AND exp_end_date = %s 
					AND status = %s
				""", (task_subject, project_title, expected_end_date, "Pending Review"))

                
                if not existing_task:
                    # Create a new Task for each milestone
                    task = frappe.get_doc({
                        "doctype": "Task",
                        "project": project_title,  # Link the Task to the Project
                        "subject": task_subject,  # Set the Task Subject
                        "status": "Pending Review",  # Set status to Pending Review
                        "exp_end_date": expected_end_date,  # Set the Expected End Date
                        "is_group": 1,  # Mark as Group Task
                        "is_milestone": 1  # Mark as Milestone Task
                    })
                    task.insert(ignore_permissions=True)
                    frappe.db.commit()
