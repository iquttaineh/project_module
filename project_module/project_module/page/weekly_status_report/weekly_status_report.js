frappe.pages['weekly-status-report'].on_page_load = function (wrapper) {
    var page = frappe.ui.make_app_page({
        parent: wrapper,
        title: 'Weekly Status Report',
        single_column: false
    });
    // <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
    // <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    var html_context = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>WSR Dashboard</title>
    </head>

    <body>
        <div class="dashboard">
            <h2 id="ReportHeader" style="color:rgb(38, 172, 217);padding-bottom:15px;text-align:center;text-decoration: underline;">Weekly Status Report (WSR)</h2>
            
            <div class="d-flex justify-content-between align-items-center mb-3">
                <!-- Dropdown Menu on the Left -->
                <div>
                    <div class="dropdown">
                        <button class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Select a project...
                        </button>
                        <div class="dropdown-menu" aria-labelledby="dropdownMenuButton" id="projectSelect">
                            <input type="text" class="form-control" id="dropdownFilter" placeholder="Search..." onkeyup="filterProjects()" style="margin: 5px; width: 95%;">
                            <!-- Project items will be appended here -->
                        </div>
                    </div>
                </div>

                <!-- Buttons on the Right -->
                <div>
                    <button id="exportPDF" class="btn btn-secondary">Export as PDF</button>
                    <button id="exportImage" class="btn btn-secondary">Export as Image</button>
                    <button id="sendEmail" class="btn btn-secondary">Send Email</button>
                </div>
            </div>

            <br>

            <!-- Project Info Table -->
            <h4 id="project-information" style="display: inline-block;">Project Information</h4>
            <span id="date-container" style="float: right; color:orange;">
                <span id="first-day" style="color:#004d66;">From: </span>
                <span id="firstDay" style="font-weight:bold;"></span>
                <span id="last-day" style="color:#004d66;">To: </span>
                <span id="lastDay" style="font-weight:bold;"></span>
            </span>

            <table id="project-info" class="project_info">
                <tbody>
                    <tr style="background-color: #ecf0f1;"
                        onmouseover="this.style.backgroundColor='#0047AB'" 
                        onmouseout="this.style.backgroundColor='#ecf0f1'"
                    >
                        <td id="td-project-name" style="width: 50%;"><b><label id="lbl-project-name">Project Name: </label></b><span id="projectName"></span></td>
                        <td id="td-project-manager" style="width: 50%;"><b><label id="lbl-project-manager">Project Manager Name: </label></b><span id="projectManager"></span></td>
                    </tr>
                    <tr style="background-color: #ecf0f1;"
                        onmouseover="this.style.backgroundColor='#0047AB'" 
                        onmouseout="this.style.backgroundColor='#ecf0f1'"
                    >
                        <td id="td-customer-name" style="width: 50%;"><b><label id="lbl-customer-name">Customer Name: </label></b><span id="customerName"></span></td>
                        <td id="td-end-date" style="width: 50%;"><b><label id="lbl-end-date">Expected End Date: </label></b><span id="expectedEndDate"></span></td>
                    </tr>
                    <tr style="background-color: #ecf0f1;"
                        onmouseover="this.style.backgroundColor='#0047AB'" 
                        onmouseout="this.style.backgroundColor='#ecf0f1'"
                    >
                        <td id="td-project-status" style="width: 50%;"><b><label id="lbl-project-status">Project Status: </label></b><span id="projectStatus"></span></td>
                        <td id="td-completed" style="width: 50%;"><b><label id="lbl-completed">% Completed: </label></b><span id="completionPercentage"></span></td>
                    </tr>
                </tbody>
            </table>

            <!-- Header -->
            <h4 id="priority-overview">Priority Overview</h4>
            <!-- Stats -->
            <div class="stats">
                <div class="stat-item">
                    <h3 id="urgent" style="color:red;">0</h3>
                    <p id="lbl-urgent">Urgent</p>
                </div>
                <div class="stat-item">
                    <h3 id="high" style="color:orange;">0</h3>
                    <p id="lbl-high">High</p>
                </div>
                <div class="stat-item">
                    <h3 id="medium" style="color:blue;">0</h3>
                    <p id="lbl-medium">Medium</p>
                </div>
                <div class="stat-item">
                    <h3 id="low" style="color:green;">0</h3>
                    <p id="lbl-low">Low</p>
                </div>
            </div>

            <!-- Charts -->
            <div class="charts">
                <div class="chart-item">
                    <h4 id="lbl-wltdvt">Work Left To Do vs. Time</h4>
                    <canvas id="WorkLeftChart"></canvas>
                </div>
                <div class="chart-item">
                    <h4 id="lbl-op">Overall Progress</h4>
                    <div style="font-size: small; color:gray;">
                        <p><u><strong><label id="lbl-conditions-lbl1">Priority:</label></strong></u><label id="lbl-conditions-lbl2"> Urgent, High
                            | </label><u><strong><label id="lbl-conditions-lbl3">Status:</label></strong></u><label id="lbl-conditions-lbl4"> Not Completed, Not Cancelled</label>
                        </p>
                    </div>
                    <canvas id="progressChart"></canvas>
                </div>
            </div>
            <div class="charts">
                <div class="chart-item">
                    <h4 id="lbl-tsd">Task Status Distribution</h4>
                    <canvas id="statusChart"></canvas>
                </div>
                <div class="chart-item">
                    <h4 id="lbl-ra">Resource Allocation</h4>
                    <canvas id="resourceChart"></canvas>
                </div>
            </div>

            <!-- Small Tables Section -->
            <div class="table-container">
                <!-- Tasks List Table -->
                <div class="small-table tasks">
                    <h4 id="lbl-tasks-list" style="color:#004d66;">Tasks List</h4>
                    <table>
                        <thead>
                            <tr>
                                <th id="th-tasks-task" style="height: 50px; text-align: center;">Task</th>
                                <th id="th-tasks-priority">Priority</th>
                                <th id="th-tasks-end-date">Expected End Date</th>
                                <th id="th-tasks-completed">% Completed</th>
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                    <button id="btn-tasks-more" class="expand-button" onclick="toggleRows(this)">Show More</button>
                </div>

                <!-- Risks Log Table -->
                <div class="small-table risks">
                    <h4 id="lbl-risks-log" style="color:#004d66;">Risks Log</h4>
                    <table>
                        <thead>
                            <tr>
                                <th id="th-risks-date" style="height: 50px; text-align: center;">Date</th>
                                <th id="th-risks-risk">Risk</th>
                                <th id="th-risks-priority">Priority</th>
                                <th id="th-risks-status">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                    <button id="btn-risks-more" class="expand-button" onclick="toggleRows(this)">Show More</button>
                </div>

                <!-- Issues Log Table -->
                <div class="small-table issues">
                    <h4 id="lbl-issues-log" style="color:#004d66;">Issues Log</h4>
                    <table>
                        <thead>
                            <tr>
                                <th id="th-issues-date" style="height: 50px; text-align: center;">Date</th>
                                <th id="th-issues-issue">Issue</th>
                                <th id="th-issues-priority">Priority</th>
                                <th id="th-issues-status">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                    <button id="btn-issues-more" class="expand-button" onclick="toggleRows(this)">Show More</button>
                </div>
            </div>
        </div>
        <br>
    </body>
    </html>`;

    page.body.html(html_context);

    // // Attach event listeners after inserting HTML content
    // document.querySelector('.btn-secondary[onclick="exportToPDF()"]').addEventListener('click', exportToPDF);
    // document.querySelector('.btn-secondary[onclick="exportToImage()"]').addEventListener('click', exportToImage);

    if (frappe.boot.lang === 'ar') {
        document.body.style.direction = 'rtl';
        document.body.style.fontFamily = "Tahoma";

        // let dashboards = document.getElementsByClassName('dashboard');
        // for (let i = 0; i < dashboards.length; i++) {
        //     dashboards[i].style.textAlign = 'right';
        // }

        document.getElementById('project-information').style.float = 'right';
        document.getElementById('date-container').style.float = 'left';

        document.getElementById('td-project-name').style.textAlign = 'right';
        document.getElementById('td-project-manager').style.textAlign = 'right';
        document.getElementById('td-customer-name').style.textAlign = 'right';
        document.getElementById('td-end-date').style.textAlign = 'right';
        document.getElementById('td-project-status').style.textAlign = 'right';
        document.getElementById('td-completed').style.textAlign = 'right';

        document.getElementById('ReportHeader').innerText = "تقرير الحالة الأسبوعي (WSR)";
    
        document.getElementById('dropdownMenuButton').innerText = "اختر مشروع...";

        document.getElementById('exportPDF').innerText = "تصدير إلى PDF";
        document.getElementById('exportImage').innerText = "تصدير إلى صورة";
        document.getElementById('sendEmail').innerText = "إرسال بريد إلكتروني";

        document.getElementById('project-information').innerText = "معلومات المشروع";
        document.getElementById('first-day').innerText = "من: ";
        document.getElementById('last-day').innerText = "إلى: ";

        document.getElementById('lbl-project-name').innerText = "إسم المشروع: ";
        document.getElementById('lbl-project-manager').innerText = "مدير المشروع: ";
        document.getElementById('lbl-customer-name').innerText = "إسم العميل: ";
        document.getElementById('lbl-end-date').innerText = "تاريخ انتهاء المشروع: ";
        document.getElementById('lbl-project-status').innerText = "حالة المشروع: ";
        document.getElementById('lbl-completed').innerText = "% اكتمال المشروع: ";

        document.getElementById('priority-overview').innerText = "نظرة عامة على الأولويات";
        document.getElementById('lbl-urgent').innerText = "حرجة";
        document.getElementById('lbl-high').innerText = "مرتفعة";
        document.getElementById('lbl-medium').innerText = "متوسطة";
        document.getElementById('lbl-low').innerText = "منخفضة";

        document.getElementById('lbl-wltdvt').innerText = "العمل المتبقي للقيام به مقابل الوقت";
        document.getElementById('lbl-op').innerText = "التقدم الشامل";
        document.getElementById('lbl-tsd').innerText = "توزيع المهمات حسب الحالة";
        document.getElementById('lbl-ra').innerText = "توزيع الموارد";

        document.getElementById('lbl-conditions-lbl1').innerText = "الأولوية:";
        document.getElementById('lbl-conditions-lbl2').innerText = " حرجة، مرتفعة | ";
        document.getElementById('lbl-conditions-lbl3').innerText = "الحالة:";
        document.getElementById('lbl-conditions-lbl4').innerText = " غير مكتملة، غير ملغية";

        document.getElementById('lbl-tasks-list').innerText = "قائمة المهام";
        document.getElementById('lbl-risks-log').innerText = "سجل المخاطر";
        document.getElementById('lbl-issues-log').innerText = "سجل المشكلات";

        document.getElementById('th-tasks-task').innerText = "المهمة";
        document.getElementById('th-tasks-priority').innerText = "الأولوية";
        document.getElementById('th-tasks-end-date').innerText = "التاريخ المتوقع للإنتهاء";
        document.getElementById('th-tasks-completed').innerText = "% الإكتمال";

        document.getElementById('th-risks-date').innerText = "التاريخ";
        document.getElementById('th-risks-risk').innerText = "الخطر";
        document.getElementById('th-risks-priority').innerText = "الأولوية";
        document.getElementById('th-risks-status').innerText = "الحالة";

        document.getElementById('th-issues-date').innerText = "التاريخ";
        document.getElementById('th-issues-issue').innerText = "المشكلة";
        document.getElementById('th-issues-priority').innerText = "الأولوية";
        document.getElementById('th-issues-status').innerText = "الحالة";
        
        document.getElementById('btn-tasks-more').innerText = "عرض المزيد";
        document.getElementById('btn-risks-more').innerText = "عرض المزيد";
        document.getElementById('btn-issues-more').innerText = "عرض المزيد";
    } else {
        document.body.style.direction = 'ltr';
        document.getElementById('project-information').style.float = 'left';
        document.getElementById('date-container').style.float = 'right';
    };

    // Set translations using frappe._()
    // document.getElementById('ReportHeader').innerText = frappe._("Weekly Status Report (WSR)");
    
    // document.getElementById('dropdownMenuButton').innerText = frappe._("Select a project...");

    // document.getElementById('exportPDF').innerText = frappe._("Weekly Status Report (WSR)");
    // document.getElementById('exportImage').innerText = frappe._("Export as Image");
    // document.getElementById('sendEmail').innerText = frappe._("Send Email");

    // document.getElementById('project-information').innerText = frappe._("Project Information");
    // document.getElementById('firstDay').innerText = frappe._("From: ");
    // document.getElementById('lastDay').innerText = frappe._("To: ");

    // document.getElementById('projectName').innerText = frappe._("Project Name: ");
    // document.getElementById('projectManager').innerText = frappe._("Project Manager Name: ");
    // document.getElementById('customerName').innerText = frappe._("Customer Name: ");
    // document.getElementById('expectedEndDate').innerText = frappe._("Expected End Date: ");
    // document.getElementById('projectStatus').innerText = frappe._("Project Status: ");
    // document.getElementById('completionPercentage').innerText = frappe._("% Completed: ");

    // document.getElementById('priority-overview').innerText = frappe._("");

    // frappe.call({
    //     method: "frappe.translate.get_translations",
    //     args: {
    //         lang: "ar"
    //     },
    //     callback: function(r) {
    //         console.log(r.message);
    //         document.getElementById("ReportHeader").innerHTML = __(r.message["Weekly Status Report (WSR)"]);
    //     }
    // });   


    document.getElementById('exportPDF').addEventListener('click', exportToPDF);
    document.getElementById('exportImage').addEventListener('click', exportToImage);
    document.getElementById('sendEmail').addEventListener('click', sendEmail);

    // Get current week's start and end dates
    function getCurrentWeekDates() {
        // if (frappe.boot.lang === 'ar') {
        //     document.body.style.direction = 'rtl';
        //     document.body.style.textAlign = 'right';
        // } else {
        //     document.body.style.direction = 'ltr';
        //     document.body.style.textAlign = 'left';
        // }

        // frappe.call({
        //     method: "frappe.client.get_doc",
        //     args: {
        //         doctype: "Translation",
        //         fields: ["language", "source_text", "translated_text"],
        //     },
        //     callback: function(r) {
        //         console.log(r.message.as_dict);
        //         // document.getElementById("ReportHeader").innerHTML = __(r.message[2]["source_text"]);
        //     }
        // });  

        // frappe.call({
        //     method: "frappe.client.get_list",
        //     args: {
        //         doctype: "Translation", // Example doctype
        //         fields: ["language", "source_text", "translated_text"],
        //         // filters: [["status", "=", "Active"]], // Optional filter
        //         // limit_page_length: 10 // Limit results
        //     },
        //     callback: function(response) {
        //         let data = response.message; // Contains the list of dictionaries

        //         console.log(data);
        
        //         // if (data) {
        //         //     // Iterate through the list
        //         //     data.forEach(item => {
        //         //         console.log("Name: " + item.name);
        //         //         console.log("Email: " + item.email_id);
        //         //     });
        //         // } else {
        //         //     console.log("No data found");
        //         // }
        //     }
        // });
        

        const today = new Date();

        // Calculate the first day of the current week (Sunday as the start of the week)
        const firstDay = new Date(today);
        firstDay.setDate(today.getDate() - today.getDay()); // Set to Sunday. getDay() returns: 0 = Sunday, 1 = Monday, ..., 6 = Saturday

        // Calculate the last day of the current week (Saturday)
        const lastDay = new Date(firstDay);
        lastDay.setDate(firstDay.getDate() + 6); // Add 6 days to get Saturday

        // Format dates as "YYYY-MM-DD"
        const formatDate = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        document.getElementById("firstDay").textContent = formatDate(firstDay);
        document.getElementById("lastDay").textContent = formatDate(lastDay);
    }
    // Call the function to set dates
    getCurrentWeekDates();

    function showAllRows() {
        const expandButtons = document.querySelectorAll('.expand-button');
        expandButtons.forEach(button => {
            const rows = button.previousElementSibling.querySelectorAll('.hidden-rows');
            rows.forEach(row => row.style.display = 'table-row');
            if (frappe.boot.lang === 'ar') {
                button.textContent = 'إظهار أقل';
            } else {
                button.textContent = 'Show Less';
            };
        });
    }

    async function exportToPDF() {
        // Ensure all rows are visible
        showAllRows();
    
        const element = document.querySelector('.dashboard'); // Target element
    
        // Temporarily adjust element style to ensure the full content is rendered
        const originalHeight = element.style.height;
        element.style.height = 'auto';
    
        // Use html-to-image to capture the full scrollable content
        htmlToImage.toPng(element, {
            width: element.scrollWidth,  // Full width of the element
            height: element.scrollHeight // Full height of the element
        })
        .then(dataUrl => {
            const { jsPDF } = window.jspdf; // Import jsPDF
    
            // Create a new PDF document
            const pdf = new jsPDF({
                orientation: 'portrait', // Change to 'landscape' if needed
                unit: 'px', // Use pixels for better scaling
                format: [element.scrollWidth, element.scrollHeight] // Match size dynamically
            });
    
            // Add the captured image to the PDF
            pdf.addImage(dataUrl, 'PNG', 0, 0, element.scrollWidth, element.scrollHeight);
    
            // Save the PDF
            pdf.save('Weekly_Status_Report.pdf');
    
            // Restore original height
            element.style.height = originalHeight;
        })
        .catch(err => {
            console.error('Error exporting PDF:', err); // Log errors
            element.style.height = originalHeight; // Restore height on error
        });
    }        

    function exportToImage() {
        // Ensure all rows are visible
        showAllRows();
    
        htmlToImage.toPng(document.querySelector('.dashboard'))
            .then(dataUrl => {
                const link = document.createElement('a');
                link.href = dataUrl;
                link.download = 'Weekly_Status_Report.png';
                link.click();
        });
    }

    function sendEmail() {
        // Ensure all rows are visible
        showAllRows();
    
        // Get project details
        const projectName = document.getElementById('projectName').textContent || "N/A";
        const fromDate = document.getElementById('firstDay').textContent || "N/A";
        const toDate = document.getElementById('lastDay').textContent || "N/A";
    
        // Generate the image using html-to-image
        htmlToImage.toPng(document.querySelector('.dashboard'))
            .then(dataUrl => {
                // Prepare email content with image embedded
                const emailSubject = `Weekly Status Report - ${projectName}`;
                const emailBody = `
                    <p>Please find the Weekly Status Report attached.</p>
                    <p><strong>From:</strong> ${fromDate} <strong>To:</strong> ${toDate}<br><br></p>
                    <p><strong>Snapshot:</strong></p>
                    <p><img src="${dataUrl}" style="max-width: 100%; height: auto;" /></p>
                `;
    
                // Send email using frappe CommunicationComposer
                new frappe.views.CommunicationComposer({
                    subject: emailSubject,
                    message: emailBody,
                });
            })
            .catch(err => {
                console.error('Error generating image:', err);
            });
    }   
    
    // function sendEmail() {
    //     // Ensure all rows are visible
    //     showAllRows();
       
    //     // Capture the dashboard as an image
    //     // const element = document.querySelector('.dashboard'); // Capture the dashboard div
    //     // html2canvas(element, { scale: 2 }).then(canvas => {
    //         // Convert the captured image to a Data URL
    //         // const imgData = canvas.toDataURL('image/jpeg');
    
    //         // // Prepare the file as base64 content
    //         // const fileContent = imgData.split(',')[1]; // Base64 data
    //         // const fileName = 'Weekly_Status_Report.jpeg';
    
    //     // Get email details dynamically
    //     const projectName = document.getElementById('projectName').textContent || "N/A";
    //     const fromDate = document.getElementById('firstDay').textContent || "N/A";
    //     const toDate = document.getElementById('lastDay').textContent || "N/A";

    //     const emailSubject = `Weekly Status Report - ${projectName}`;
    //     const emailBody = `
    //         <p>Please find the Weekly Status Report attached.</p>
    //         <p><strong>From:</strong> ${fromDate} <strong>To:</strong> ${toDate}<br><br></p>
    //     `;

    //     new frappe.views.CommunicationComposer({
    //         subject: emailSubject,
    //         message: emailBody,
    //     });
    
    //         // // Call the Python function to upload and attach the file
    //         // frappe.call({
    //         //     method: "project_module.api.task.upload_file", // frappe-bench/apps/erpnext/erpnext/api/task.py
    //         //     args: {
    //         //         file_name: fileName,
    //         //         file_content: fileContent,
    //         //         subject: emailSubject,
    //         //         message: emailBody
    //         //     },
    //         //     callback: function (response) {
    //         //         if (response.message && response.message.status === "success") {
    //         //             // Open ERPNext Email Dialog with attachment using file_id
    //         //             new frappe.views.CommunicationComposer({
    //         //                 subject: response.message.subject,
    //         //                 recipients: '',
    //         //                 attach_document: true,
    //         //                 attachments: [
    //         //                     {
    //         //                         file_url: response.message.file_url, // Use file_url for debugging visibility
    //         //                         file_id: response.message.file_id,   // Attach using file_id for backend compatibility
    //         //                         folder: response.message.folder
    //         //                     }
    //         //                 ],
    //         //                 message: response.message.message,
    //         //             });
    //         //         } else {
    //         //             frappe.msgprint(__('Failed to upload or attach the file.'));
    //         //         }
    //         //     },
    //         //     error: function () {
    //         //         frappe.msgprint(__('Failed to communicate with the server.'));
    //         //     }
    //         // });
    //     // });
    // }

    function loadProjects() {
        frappe.call({
            method: "frappe.client.get_list",
            args: {
                doctype: "Project",
                filters: {
                    // owner: frappe.session.user,
                    company: frappe.defaults.get_default("company"), // Fetches the user's default company
                },
                fields: ["name", "project_name", "customer", "expected_end_date", "status", "percent_complete"],
            },
            callback: function (response) {
                if (response.message) {
                    const projects = response.message || [];
                    const projectSelect = document.getElementById("projectSelect");
    
                    // Clear previous items
                    projectSelect.innerHTML = '<input type="text" class="form-control" id="dropdownFilter" placeholder="Search..." onkeyup="filterProjects()" style="margin: 5px; width: 95%;">';
    
                    // // Add the default "Select a project..." item at the top
                    // const placeholder = document.createElement("a");
                    // placeholder.href = "#";
                    // // placeholder.classList.add("dropdown-item", "disabled");  // 'disabled' class makes it unclickable
                    // placeholder.classList.add("dropdown-item");
                    // placeholder.textContent = "Select a project...";
                    // projectSelect.appendChild(placeholder);

                    // // Add click event to call loadProjectDetails with project.name
                    // placeholder.onclick = function(event) {
                    //     event.preventDefault();

                    //     // Update the button text with the selected project name
                    //     document.getElementById("dropdownMenuButton").textContent = "Select a project...";

                    //     clearControls();
                    // };

                    // Append project links as dropdown items
                    projects.forEach(project => {
                        const anchor = document.createElement("a");
                        anchor.href = "#";
                        anchor.classList.add("dropdown-item");
                        anchor.textContent = project.name + " - " + project.project_name;
    
                        // Add click event to call loadProjectDetails with project.name
                        anchor.onclick = function(event) {
                            event.preventDefault();

                            // Update the button text with the selected project name
                            document.getElementById("dropdownMenuButton").textContent = project.name + " - " + project.project_name;

                            // Call loadProjectDetails with the selected project name
                            loadProjectDetails(project.name);
                        };
    
                        projectSelect.appendChild(anchor);
                    });
                }
            }
        });
        
    }
    // Load projects when the page loads
    loadProjects();
};

// Filter function for the dropdown items
function filterProjects() {
    const input = document.getElementById("dropdownFilter");
    const filter = input.value.toLowerCase();
    const dropdownItems = document.querySelectorAll("#projectSelect .dropdown-item");

    dropdownItems.forEach(item => {
        const text = item.textContent || item.innerText;
        item.style.display = text.toLowerCase().includes(filter) ? "" : "none";
    });
}

// Function to load project details into the dashboard
function loadProjectDetails(projectName) {
    clearControls();

    if(projectName){
        // Fill Project Information table
        frappe.call({
            method: "frappe.client.get",
            args: {
                doctype: "Project",
                name: projectName
            },
            callback: function (response) {
                const project = response.message;
                if (project) {
                    document.getElementById("projectName").textContent = project.project_name;
                    document.getElementById("customerName").textContent = project.customer || "N/A";
                    document.getElementById("expectedEndDate").textContent = project.expected_end_date || "N/A";
                    document.getElementById("projectStatus").textContent = project.status || "N/A";
                    document.getElementById("completionPercentage").textContent = project.percent_complete || "N/A";
                }
            }
        });
        
        // Get Project Charter details
        frappe.call({
            method: "frappe.client.get_list",
            args: {
                doctype: "Project Charter",
                filters: {
                    project_title: projectName
                },
                fields: ["project_manager"] // Specify the fields you want to retrieve
            },
            callback: function (response) {
                // console.log(response);
                const projectManager = response.message[0].project_manager || "N/A"; // Retrieve the project_manager field

                if (response.message && response.message.length > 0) {
                    var project_manager_name
                    frappe.db.get_value('Project Members', projectManager, 'member_name')
                    .then(response => {
                        project_manager_name = response.message.member_name;
                        document.getElementById("projectManager").textContent = project_manager_name || "N/A";
                        // console.log('Project Manager Name:', project_manager_name);
                    })
                    .catch(error => {
                        console.error('Error fetching project manager name:', error);
                    });
                } else {
                    console.error("No project found for the specified project name");
                }
            },
            error: function (err) {
                console.error("Error fetching project:", err);
            }
        });

        // Handle Urgent Tasks card
        frappe.call({
            method: "frappe.client.get_count",
            args: {
                doctype: "Task", 
                filters: {
                    project: projectName,
                    priority: "Urgent" 
                }
            },
            callback: function (response) {
                if (response.message !== undefined) {
                    const taskCount = response.message;
                    document.querySelector('#urgent').textContent = taskCount;
                } else {
                    console.log("No tasks found for the specified priority.");
                }
            },
            error: function (err) {
                console.error("Error fetching task count:", err);
            }
        });

        // Handle High Tasks card
        frappe.call({
            method: "frappe.client.get_count",
            args: {
                doctype: "Task", 
                filters: {
                    project: projectName,
                    priority: "High" 
                }
            },
            callback: function (response) {
                if (response.message !== undefined) {
                    const taskCount = response.message;
                    document.querySelector('#high').textContent = taskCount;
                } else {
                    console.log("No tasks found for the specified priority.");
                }
            },
            error: function (err) {
                console.error("Error fetching task count:", err);
            }
        });

        // Handle Medium Tasks card
        frappe.call({
            method: "frappe.client.get_count",
            args: {
                doctype: "Task", 
                filters: {
                    project: projectName,
                    priority: "Medium" 
                }
            },
            callback: function (response) {
                if (response.message !== undefined) {
                    const taskCount = response.message;
                    document.querySelector('#medium').textContent = taskCount;
                } else {
                    console.log("No tasks found for the specified priority.");
                }
            },
            error: function (err) {
                console.error("Error fetching task count:", err);
            }
        });

        // Handle Low Tasks card
        frappe.call({
            method: "frappe.client.get_count",
            args: {
                doctype: "Task", 
                filters: {
                    project: projectName,
                    priority: "Low" 
                }
            },
            callback: function (response) {
                if (response.message !== undefined) {
                    const taskCount = response.message;
                    document.querySelector('#low').textContent = taskCount;
                } else {
                    console.log("No tasks found for the specified priority.");
                }
            },
            error: function (err) {
                console.error("Error fetching task count:", err);
            }
        });

        // Get Tasks List
        frappe.call({
            method: "frappe.client.get_list",
            args: {
                doctype: "Task",
                filters: {
                    project: projectName
                },
                fields: ["name", "subject", "priority", "progress", "exp_end_date", "status"]
            },
            callback: function (response) {
                if (response.message && response.message.length > 0) {
                    const tasks = response.message;
                    
                    // // Convert `exp_end_date` to Date objects with only the date part
                    // tasks.forEach(task => {
                    //     const date = new Date(task.exp_end_date);
                    //     task.exp_end_date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
                    // });
                    // // Sort the tasks array by the 'progress' field in ascending order (use 'desc' for descending)
                    // // If you want descending order, use: tasks.sort((a, b) => b.progress - a.progress);
                    // tasks.sort((a, b) => a.progress - b.progress); // Ascending order

                    const tableBody = document.querySelector('.tasks tbody');
                    tableBody.innerHTML = ''; // Clear existing rows

                    // Sort the tasks array by the `exp_end_date` field (you can adjust sorting order as needed)
                    tasks.sort((b, a) => {
                        if (a.exp_end_date < b.exp_end_date) return -1; // Ascending order
                        if (a.exp_end_date > b.exp_end_date) return 1;
                        return 0;
                    });

                    // Render the sorted risks
                    tasks.forEach((task, index) => {
                        const row = document.createElement('tr');
                        // task.exp_end_date = new Date(task.exp_end_date.getFullYear(), task.exp_end_date.getMonth(), task.exp_end_date.getDate());
                        row.innerHTML = `
                            <td>${task.subject}</td>
                            <td>${task.priority}</td>
                            <td style="white-space: nowrap; width: auto;">${task.exp_end_date}</td>
                            <td>
                                <div class="progress" style="height: 20px;">
                                    <div class="progress-bar bg-warning" role="progressbar"
                                        style="width: ${task.progress}%; color:black;"
                                        aria-valuenow="${task.progress}" aria-valuemin="0" aria-valuemax="100">
                                        ${task.progress}%
                                    </div>
                                </div>
                            </td>
                        `;
                        
                        // Check if row index is greater than 3 (i.e., 5th row or later)
                        if (index > 3) {
                            row.className = 'hidden-rows'; // Apply your style here
                        }

                        tableBody.appendChild(row);
                    });
                } else {
                    console.log("No tasks found for the specified project.");
                }
            },
            error: function (err) {
                console.error("Error fetching tasks:", err);
            }
        });

        // Get Risks Log List
        frappe.call({
            method: "frappe.client.get_list",
            args: {
                doctype: "Risks Log",
                filters: {
                    project: projectName
                },
                fields: ["creation_date", "priority", "subject", "status"]
            },
            callback: function (response) {
                if (response.message && response.message.length > 0) {
                    const risks = response.message;
                    const tableBody = document.querySelector('.risks tbody');
                    tableBody.innerHTML = ''; // Clear existing rows
                    
                    // Sort the risks array by the `status` field (you can adjust sorting order as needed)
                    risks.sort((a, b) => {
                        if (a.status < b.status) return -1; // Ascending order
                        if (a.status > b.status) return 1;
                        return 0;
                    });

                    // Render the sorted risks
                    risks.forEach((risk, index) => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td style="white-space: nowrap; width: auto;">${risk.creation_date}</td>
                            <td>${risk.subject}</td>
                            <td>${risk.priority}</td>
                            <td>${risk.status}</td>
                        `;

                        // Check if row index is greater than 3 (i.e., 5th row or later)
                        if (index > 3) {
                            row.className = 'hidden-rows'; // Apply your style here
                        }

                        tableBody.appendChild(row);
                    });
                } else {
                    console.log("No risks found for the specified project.");
                }
            },
            error: function (err) {
                console.error("Error fetching risks:", err);
            }
        });

        // Get Issues Log List
        frappe.call({
            method: "frappe.client.get_list",
            args: {
                doctype: "Issues Log",
                filters: {
                    project: projectName
                },
                fields: ["creation_date", "priority", "subject", "status"]
            },
            callback: function (response) {
                if (response.message && response.message.length > 0) {
                    const issues = response.message;
                    const tableBody = document.querySelector('.issues tbody');
                    tableBody.innerHTML = ''; // Clear existing rows

                    // Sort the issues array by the `status` field (you can adjust sorting order as needed)
                    issues.sort((a, b) => {
                        if (a.status < b.status) return -1; // Ascending order
                        if (a.status > b.status) return 1;
                        return 0;
                    });

                    issues.forEach((issue, index) => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td style="white-space: nowrap; width: auto;">${issue.creation_date}</td>
                            <td>${issue.subject}</td>
                            <td>${issue.priority}</td>
                            <td>${issue.status}</td>
                        `;

                        // Check if row index is greater than 3 (i.e., 5th row or later)
                        if (index > 3) {
                            row.className = 'hidden-rows'; // Apply your style here
                        }
                        
                        tableBody.appendChild(row);
                    });
                } else {
                    console.log("No issues found for the specified project.");
                }
            },
            error: function (err) {
                console.error("Error fetching issues:", err);
            }
        });

        // Work Left To Do vs. Time Chart
        frappe.call({
            method: "erpnext.api.task.get_work_left",
            args: {
                projectname: projectName
            },
            callback: function (response) {
                if (response && response.message) {
                    const workLeftData = response.message; // This should be the array of objects with week and remaining work
                    // Extracting month names and remaining percentages
                    const labels = workLeftData.map(item => item.month_name); // Get the time span labels
                    const data = workLeftData.map(item => item.remaining_percentage); // Get the work left for each time span
                    const chartType = 'line';
                    const chartName = 'WorkLeftChart';
                    createWorkLeftChart(labels, data, chartType, chartName); // Call function to create the chart with the retrieved data
                } else {
                    console.error("Failed to retrieve work left");
                }
            }
        });

        // Overall Progress Chart
        frappe.call({
            method: "frappe.client.get_list",
            args: {
                doctype: "Task",
                filters: [
                    ["project", "=", projectName],
                    ["priority", "in", ["Urgent", "High"]],
                    ["status", "not in", ["Completed", "Cancelled"]]
                ],
                fields: ["subject", "progress"]
            },
            callback: function (response) {
                if (response && response.message) {
                    const progressData = response.message; // This should be the array of objects with task and progress
                    // Sort the progressData array by the 'progress' field in ascending order (use 'desc' for descending)
                    // If you want descending order, use: progressData.sort((a, b) => b.progress - a.progress);
                    progressData.sort((a, b) => a.progress - b.progress); // Ascending order
                    // Extracting task names and progress percentages
                    const labels = progressData.map(item => item.subject); // Get the task labels
                    const data = progressData.map(item => item.progress); // Get the progress for each task
                    const chartType = 'bar';
                    const chartName = 'progressChart';
                    createProgressChart(labels, data, chartType, chartName); // Call function to create the chart with the retrieved data
                } else {
                    console.error("Failed to retrieve overall progress");
                }
            }
        });

        // Task Status Distribution Chart
        frappe.call({
            method: "erpnext.api.task.get_status_counts",
            args: {
                projectname: projectName
            },
            callback: function (response) {
                if (response && response.message) {
                    const statusData = response.message; // This should be the array of objects with status and count
                    // Extracting statuses and counts
                    const labels = statusData.map(item => item.status); // Get the status labels
                    const data = statusData.map(item => item.count); // Get the count for each status
                    const chartType = 'pie';
                    const chartName = 'statusChart';
                    createStatusChart(labels, data, chartType, chartName); // Call function to create the chart with the retrieved data
                } else {
                    console.error("Failed to retrieve status counts");
                }
            }

        });

        // Resource Allocation Chart
        frappe.call({
            method: "erpnext.api.task.get_task_counts_by_employee",
            args: {
                projectname: projectName
            },
            callback: function (response) {
                if (response && response.message) {
                    const resourceData = response.message; // This should be the array of objects with resource and count
                    // Extracting resources and counts
                    const labels = resourceData.map(item => item.employee); // Get the resource labels
                    const data = resourceData.map(item => item.count); // Get the count for each resource
                    const chartType = 'bar';
                    const chartName = 'resourceChart';
                    createResourceChart(labels, data, chartType, chartName); // Call function to create the chart with the retrieved data
                } else {
                    console.error("Failed to retrieve resource counts");
                }
            }

        });
    }
}

// Clear all controls from data
function clearControls() {
    // Clear data from Table Info if no project is selected
    document.getElementById("projectName").textContent = "";
    document.getElementById("projectManager").textContent = "";
    document.getElementById("customerName").textContent = "";
    document.getElementById("expectedEndDate").textContent = "";
    document.getElementById("projectStatus").textContent = "";
    document.getElementById("completionPercentage").textContent = "";

    // Clear cards data
    document.querySelector('#urgent').textContent = "0";
    document.querySelector('#high').textContent = "0";
    document.querySelector('#medium').textContent = "0";
    document.querySelector('#low').textContent = "0";

    // Clear charts stats
    if (workLeftchart) {
        workLeftchart.destroy();
    }
    if (progressChart) {
        progressChart.destroy();
    }
    if (statusChart) {
        statusChart.destroy();
    }
    if (resourceChart) {
        resourceChart.destroy();
    }

    // Clear tables rows
    const tableBodyTasks = document.querySelector('.tasks tbody');
    tableBodyTasks.innerHTML = '';
    const tableBodyRisks = document.querySelector('.risks tbody');
    tableBodyRisks.innerHTML = '';
    const tableBodyIssues = document.querySelector('.issues tbody');
    tableBodyIssues.innerHTML = '';
}

// "Show More / Show Less" handling
function toggleRows(button) {
    const rows = button.previousElementSibling.querySelectorAll('.hidden-rows');
    rows.forEach(row => row.style.display = row.style.display === 'table-row' ? 'none' : 'table-row');

    // if (button.textContent === 'Show More') {
    //     button.textContent = 'Show Less';
    // } else {
    //     button.textContent = 'Show More';
    // }

    if (frappe.boot.lang === 'ar') {
        if (button.textContent === 'عرض المزيد') {
            button.textContent = 'إظهار أقل';
        } else {
            button.textContent = 'عرض المزيد';
        }
    } else {
        if (button.textContent === 'Show More') {
            button.textContent = 'Show Less';
        } else {
            button.textContent = 'Show More';
        }
    };
}

// // Create Chart
// function createChart(labels, data, chartType, chartName){
//     const chart = new frappe.Chart(chartName, {
//         type: chartType,
//         data: {
//             labels: labels,
//             datasets: [{
//                 values: data
//             }]
//         }
//     });
// }

// Declare a variable to hold the chart instance
let workLeftchart;
let progressChart;
let statusChart;
let resourceChart;

// Create Work Left To Do vs. Time Chart
function createWorkLeftChart(labels, data, chartType, chartName){
    const Ctx = document.getElementById(chartName).getContext('2d');

    // Check if the chart already exists and destroy it if it does
    if (workLeftchart) {
        workLeftchart.destroy();
    }

    let wltdvtChartLabel = frappe.boot.lang === 'ar' ? 'النسبة المتبقية (%)' : 'Percentage Left (%)';

    workLeftchart = new Chart(Ctx, {
        type: chartType,
        data: {
            labels: labels,
            datasets: [{
                label: wltdvtChartLabel,
                data: data,
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            plugins: {
                legend: {
                    labels: {
                        font: {
                            family: 'Tahoma'
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                    },
                    ticks: {
                        minRotation: 45,  // Set minimum rotation for labels
                        maxRotation: 45   // Set maximum rotation for labels
                    }
                },
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                    }
                }
            }
        }
    });
}

// Create Overall Progress Chart
function createProgressChart(labels, data, chartType, chartName){
    const Ctx = document.getElementById(chartName).getContext('2d');

    // Check if the chart already exists and destroy it if it does
    if (progressChart) {
        progressChart.destroy();
    }

    let opChartLabel = frappe.boot.lang === 'ar' ? '% الإكتمال' : '% Completed';

    progressChart = new Chart(Ctx, {
        type: chartType,
        data: {
            labels: labels,
            datasets: [{
                label: opChartLabel,
                data: data,
                backgroundColor: 'rgba(255, 206, 86, 0.6)',
                borderColor: 'rgba(255, 206, 86, 1)',
                borderWidth: 1
            }]
        },
        options: {
            plugins: {
                legend: {
                    labels: {
                        font: {
                            family: 'Tahoma'
                        }
                    }
                }
            },
            indexAxis: 'y',
            scales: {
                x: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Create Task Status Distribution Chart
function createStatusChart(labels, data, chartType, chartName){
    const Ctx = document.getElementById(chartName).getContext('2d');

    // Check if the chart already exists and destroy it if it does
    if (statusChart) {
        statusChart.destroy();
    }

    statusChart = new Chart(Ctx, {
        type: chartType,
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: [
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(255, 159, 64, 0.6)',
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 255, 130, 0.6)',
                    'rgba(169, 169, 169, 0.6)'
                ]
            }]
        }
    });
}

// Create Resource Allocation Chart
function createResourceChart(labels, data, chartType, chartName){
    const Ctx = document.getElementById(chartName).getContext('2d');

    // Check if the chart already exists and destroy it if it does
    if (resourceChart) {
        resourceChart.destroy();
    }

    let raChartLabel = frappe.boot.lang === 'ar' ? 'عدد المهام' : 'Number of Tasks';

    resourceChart = new Chart(Ctx, {
        type: chartType,
        data: {
            labels: labels,
            datasets: [{
                label: raChartLabel,
                data: data,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            plugins: {
                legend: {
                    labels: {
                        font: {
                            family: 'Tahoma'
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}