# Copyright (c) 2024, Ishaq and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class Meeting(Document):
	def on_update(self):
		tasks_created = []
		for action in self.actions:
			project = self.project.strip() if self.project else None
			task_subject = action.action.strip() if action.action else None
			parent_task = action.milestone.strip() if action.milestone else None
			expected_end_date = action.expected_completion_date
			priority = action.priority
			description = action.description
			responsible_party = action.responsible_party

			if task_subject and expected_end_date:
				existing_task = frappe.get_value(
					"Task",
					{
						"subject": task_subject,
						"project": project,
						"parent_task": parent_task,
						"exp_end_date": expected_end_date,
						"status": "Pending Review",
					},
					"name"
				)

				if not existing_task:
					task = frappe.get_doc({
						"doctype": "Task",
						"project": project,
						"subject": task_subject,
						"parent_task": parent_task,
						"priority": priority,
						"status": "Pending Review",
						"exp_end_date": expected_end_date,
						"description": description,
						"responsible_party": responsible_party,
					})
					task.insert(ignore_permissions=True)
					tasks_created.append(task.name)

		if tasks_created:
			frappe.db.commit()
			frappe.logger().info(f"Tasks created: {tasks_created}")
