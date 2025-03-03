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
            expected_start_date = milestone.estimated_starting_date
            expected_end_date = milestone.estimated_completion_date

            if task_subject and expected_end_date:
                # Normalize and check if task exists
                existing_task = frappe.db.sql("""
					SELECT name 
					FROM `tabTask` 
					WHERE subject = %s 
					AND project = %s 
                    AND exp_start_date = %s 
					AND exp_end_date = %s 
					AND status = %s
				""", (task_subject, project_title, expected_start_date, expected_end_date, "Pending Review"))

                
                if not existing_task:
                    # Create a new Task for each milestone
                    task = frappe.get_doc({
                        "doctype": "Task",
                        "project": project_title,  # Link the Task to the Project
                        "subject": task_subject,  # Set the Task Subject
                        "status": "Pending Review",  # Set status to Pending Review
                        "exp_start_date": expected_start_date,  # Set the Expected Start Date
                        "exp_end_date": expected_end_date,  # Set the Expected End Date
                        "is_group": 1,  # Mark as Group Task
                        "is_milestone": 1  # Mark as Milestone Task
                    })
                    task.insert(ignore_permissions=True)
                    frappe.db.commit()
    # def on_load(self):
    #     from requests import Request, Session
    #     from requests.exceptions import ConnectionError, Timeout, TooManyRedirects
    #     import json

    #     url = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest'

    #     parameters = {
    #         'start': '1',
    #         'limit': '5000',
    #         'convert': 'USD'
    #     }
    #     headers = {
    #         'Accepts': 'application/json',
    #         'X-CMC_PRO_API_KEY': '82fa1aa2-2857-4523-9055-f758f10b41ac',
    #     }

    #     session = Session()
    #     session.headers.update(headers)

    #     try:
    #         print("Sending request...")
    #         response = session.get(url, params=parameters)
    #         print(f"Response Status Code: {response.status_code}")

    #         if response.status_code == 200:
    #             data = response.json()
    #             print("Data received successfully.")
    #             with open("coinmarketcap.json", "w") as fw:
    #                 json.dump(data, fw, indent=4)
    #         else:
    #             print(f"Error: {response.status_code}")
    #             print(response.text)

    #     except (ConnectionError, Timeout, TooManyRedirects) as e:
    #         print(f"Request failed: {e}")

    #     except json.JSONDecodeError:
    #         print("Failed to decode JSON from the response.")

    # on_load(None)
