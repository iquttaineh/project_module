app_name = "project_module"
app_title = "Project Module"
app_publisher = "Ishaq"
app_description = "Charter and Report"
app_email = "ishaq.quttaineh@focuskm.com"
app_license = "mit"
# required_apps = []

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
# app_include_css = "/assets/project_module/css/project_module.css"
app_include_css = "/MyPage/wsr_styles.css"
# app_include_js = "https://cdn.jsdelivr.net/npm/chart.js"
app_include_js = [
    "https://cdn.jsdelivr.net/npm/chart.js",
    "https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.7/dist/umd/popper.min.js",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js",
    "https://cdn.jsdelivr.net/npm/frappe-gantt@0.5.0/dist/frappe-gantt.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.9.2/html2pdf.bundle.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js",
    "https://cdn.jsdelivr.net/npm/html-to-image@1.11.11/dist/html-to-image.min.js",
    # "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.4.0/jspdf.umd.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"
    ]

# include js, css files in header of web template
# web_include_css = "/assets/project_module/css/project_module.css"
web_include_css = "/MyPage/wsr_styles.css"
# web_include_js = "/assets/project_module/js/project_module.js"

# include custom scss in every website theme (without file extension ".scss")
# website_theme_scss = "project_module/public/scss/website"

# include js, css files in header of web form
# webform_include_js = {"doctype": "public/js/doctype.js"}
# webform_include_css = {"doctype": "public/css/doctype.css"}

# include js in page
# page_js = {"page" : "public/js/file.js"}

# include js in doctype views
# doctype_js = {"doctype" : "public/js/doctype.js"}
# doctype_list_js = {"doctype" : "public/js/doctype_list.js"}
# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}

# Svg Icons
# ------------------
# include app icons in desk
# app_include_icons = "project_module/public/icons.svg"

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
# 	"Role": "home_page"
# }

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Jinja
# ----------

# add methods and filters to jinja environment
# jinja = {
# 	"methods": "project_module.utils.jinja_methods",
# 	"filters": "project_module.utils.jinja_filters"
# }

# Installation
# ------------

# before_install = "project_module.install.before_install"
# after_install = "project_module.install.after_install"

# Uninstallation
# ------------

# before_uninstall = "project_module.uninstall.before_uninstall"
# after_uninstall = "project_module.uninstall.after_uninstall"

# Integration Setup
# ------------------
# To set up dependencies/integrations with other apps
# Name of the app being installed is passed as an argument

# before_app_install = "project_module.utils.before_app_install"
# after_app_install = "project_module.utils.after_app_install"

# Integration Cleanup
# -------------------
# To clean up dependencies/integrations with other apps
# Name of the app being uninstalled is passed as an argument

# before_app_uninstall = "project_module.utils.before_app_uninstall"
# after_app_uninstall = "project_module.utils.after_app_uninstall"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "project_module.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
# 	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
# 	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# DocType Class
# ---------------
# Override standard doctype classes

# override_doctype_class = {
# 	"ToDo": "custom_app.overrides.CustomToDo"
# }

# Document Events
# ---------------
# Hook on document methods and events

# doc_events = {
# 	"*": {
# 		"on_update": "method",
# 		"on_cancel": "method",
# 		"on_trash": "method"
# 	}
# }

# doc_events = {
# 	"Task": {
#         "on_update": "project_module.project_module.doctype.risks_log.risk"
# 	}
# }

# Scheduled Tasks
# ---------------

# scheduler_events = {
# 	"all": [
# 		"project_module.tasks.all"
# 	],
# 	"daily": [
# 		"project_module.tasks.daily"
# 	],
# 	"hourly": [
# 		"project_module.tasks.hourly"
# 	],
# 	"weekly": [
# 		"project_module.tasks.weekly"
# 	],
# 	"monthly": [
# 		"project_module.tasks.monthly"
# 	],
# }

# Testing
# -------

# before_tests = "project_module.install.before_tests"

# Overriding Methods
# ------------------------------
#
# override_whitelisted_methods = {
# 	"frappe.desk.doctype.event.event.get_events": "project_module.event.get_events"
# }
#
# each overriding function accepts a `data` argument;
# generated from the base implementation of the doctype dashboard,
# along with any modifications made in other Frappe apps
# override_doctype_dashboards = {
# 	"Task": "project_module.task.get_dashboard_data"
# }

# exempt linked doctypes from being automatically cancelled
#
# auto_cancel_exempted_doctypes = ["Auto Repeat"]

# Ignore links to specified DocTypes when deleting documents
# -----------------------------------------------------------

# ignore_links_on_delete = ["Communication", "ToDo"]

# Request Events
# ----------------
# before_request = ["project_module.utils.before_request"]
# after_request = ["project_module.utils.after_request"]

# Job Events
# ----------
# before_job = ["project_module.utils.before_job"]
# after_job = ["project_module.utils.after_job"]

# User Data Protection
# --------------------

# user_data_fields = [
# 	{
# 		"doctype": "{doctype_1}",
# 		"filter_by": "{filter_by}",
# 		"redact_fields": ["{field_1}", "{field_2}"],
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_2}",
# 		"filter_by": "{filter_by}",
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_3}",
# 		"strict": False,
# 	},
# 	{
# 		"doctype": "{doctype_4}"
# 	}
# ]

# Authentication and authorization
# --------------------------------

# auth_hooks = [
# 	"project_module.auth.validate"
# ]

# Automatically update python controller files with type annotations for this app.
# export_python_type_annotations = True

# default_log_clearing_doctypes = {
# 	"Logging DocType Name": 30  # days to retain logs
# }

# fixtures = [
#     "Project Charter", "Meeting", "Meeting Schedule", "Attendees", "Members", 
#     "Project Members", "Stakeholders", "Risk Levels Child", "Risk Levels", "Issues Log", 
#     "Risks Log", "Actions", "Constraints", "Business Need", "Stakeholder Party", 
#     "Payment Plan", "Stakeholder Type", "Payment Against", "Project Budget Category", "Milestones", 
#     "Risks", "Project Budget", "Payment Type", "Activity Cost", "Penalties", 
#     "SLA Approval", "SLA Versions", "Validity of Agreement", "Service Performance Metrics", "Conditions of Cancellation", 
#     "Excluded Services", "Service Availability", "Service Assumptions", "Service Provider Requirements", "Customer Requirements", 
#     "Service Scope", "Goals and Objectives", "Project Objectives", "Key Deliverables", "Project Scope", 
#     "Project", "Task"
# ]
