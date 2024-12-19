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
            <h2 style="color:rgb(38, 172, 217);padding-bottom:15px;">Weekly Status Report (WSR)</h2>
            
            <div class="dropdown">
                <button class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Select a project...
                </button>
                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton" id="projectSelect">
                    <input type="text" class="form-control" id="dropdownFilter" placeholder="Search..." onkeyup="filterProjects()" style="margin: 5px; width: 95%;">
                    <!-- Project items will be appended here -->
                    
                </div>
            </div>

            <br>

            <!-- Project Info Table -->
            <h4 style="display: inline-block;">Project Information</h4>
            <span style="float: right; color:orange;">
                <span style="color:#004d66;">From: </span>
                <span id="firstDay" style="font-weight:bold;"></span>
                <span style="color:#004d66;">To: </span>
                <span id="lastDay" style="font-weight:bold;"></span>
            </span>

            <table class="project_info">
                <tbody>
                    <tr style="background-color: #ecf0f1;"
                        onmouseover="this.style.backgroundColor='#0047AB'" 
                        onmouseout="this.style.backgroundColor='#ecf0f1'"
                    >
                        <td style="width: 50%;"><b>Project Name: </b><span id="projectName"></span></td>
                        <td style="width: 50%;"><b>Project Manager Name: </b><span id="projectManager"></span></td>
                    </tr>
                    <tr style="background-color: #ecf0f1;"
                        onmouseover="this.style.backgroundColor='#0047AB'" 
                        onmouseout="this.style.backgroundColor='#ecf0f1'"
                    >
                        <td style="width: 50%;"><b>Customer Name: </b><span id="customerName"></span></td>
                        <td style="width: 50%;"><b>Expected End Date: </b><span id="expectedEndDate"></span></td>
                    </tr>
                    <tr style="background-color: #ecf0f1;"
                        onmouseover="this.style.backgroundColor='#0047AB'" 
                        onmouseout="this.style.backgroundColor='#ecf0f1'"
                    >
                        <td style="width: 50%;"><b>Project Status: </b><span id="projectStatus"></span></td>
                        <td style="width: 50%;"><b>% Completed: </b><span id="completionPercentage"></span></td>
                    </tr>
                </tbody>
            </table>

            <!-- Header -->
            <h4>Priority Overview</h4>
            <!-- Stats -->
            <div class="stats">
                <div class="stat-item">
                    <h3 id="urgent" style="color:red;">0</h3>
                    <p>Urgent</p>
                </div>
                <div class="stat-item">
                    <h3 id="high" style="color:orange;">0</h3>
                    <p>High</p>
                </div>
                <div class="stat-item">
                    <h3 id="medium" style="color:blue;">0</h3>
                    <p>Medium</p>
                </div>
                <div class="stat-item">
                    <h3 id="low" style="color:green;">0</h3>
                    <p>Low</p>
                </div>
            </div>

            <!-- Charts -->
            <div class="charts">
                <div class="chart-item">
                    <h4>Work Left To Do vs. Time</h4>
                    <canvas id="WorkLeftChart"></canvas>
                </div>
                <div class="chart-item">
                    <h4>Overall Progress</h4>
                    <div style="font-size: small; color:gray;">
                        <p><u><strong>Priority:</strong></u> Urgent, High
                            | <u><strong>Status:</strong></u> Not Completed, Not Cancelled
                        </p>
                    </div>
                    <canvas id="progressChart"></canvas>
                </div>
            </div>
            <div class="charts">
                <div class="chart-item">
                    <h4>Task Status Distribution</h4>
                    <canvas id="statusChart"></canvas>
                </div>
                <div class="chart-item">
                    <h4>Resource Allocation</h4>
                    <canvas id="resourceChart"></canvas>
                </div>
            </div>

            <!-- Small Tables Section -->
            <div class="table-container">
                <!-- Tasks List Table -->
                <div class="small-table tasks">
                    <h4 style="color:#004d66;">Tasks List</h4>
                    <table>
                        <thead>
                            <tr>
                                <th style="height: 50px; text-align: center;">Task</th>
                                <th>Priority</th>
                                <th>Expected End Date</th>
                                <th>% Completed</th>
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                    <button class="expand-button" onclick="toggleRows(this)">Show More</button>
                </div>

                <!-- Risks Log Table -->
                <div class="small-table risks">
                    <h4 style="color:#004d66;">Risks Log</h4>
                    <table>
                        <thead>
                            <tr>
                                <th style="height: 50px; text-align: center;">Date</th>
                                <th>Risk</th>
                                <th>Priority</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                    <button class="expand-button" onclick="toggleRows(this)">Show More</button>
                </div>

                <!-- Issues Log Table -->
                <div class="small-table issues">
                    <h4 style="color:#004d66;">Issues Log</h4>
                    <table>
                        <thead>
                            <tr>
                                <th style="height: 50px; text-align: center;">Date</th>
                                <th>Issue</th>
                                <th>Priority</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                    <button class="expand-button" onclick="toggleRows(this)">Show More</button>
                </div>
            </div>
        </div>
        <br>
    </body>
    </html>`;

    page.body.html(html_context);

    // Get current week's start and end dates
    function getCurrentWeekDates() {
        const today = new Date();

        // Calculate the first day of the current week (Sunday as the start of the week)
        const firstDay = new Date(today);
        firstDay.setDate(today.getDate() - today.getDay()); // Set to Sunday

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

    function loadProjects() {
        frappe.call({
            method: "frappe.client.get_list",
            args: {
                doctype: "Project",
                filters: {
                    owner: frappe.session.user,
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

    if (button.textContent === 'Show More') {
        button.textContent = 'Show Less';
    } else {
        button.textContent = 'Show More';
    }
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

    workLeftchart = new Chart(Ctx, {
        type: chartType,
        data: {
            labels: labels,
            datasets: [{
                label: 'Percentage Left (%)',
                data: data,
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
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

    progressChart = new Chart(Ctx, {
        type: chartType,
        data: {
            labels: labels,
            datasets: [{
                label: '% Completed',
                data: data,
                backgroundColor: 'rgba(255, 206, 86, 0.6)',
                borderColor: 'rgba(255, 206, 86, 1)',
                borderWidth: 1
            }]
        },
        options: {
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

    resourceChart = new Chart(Ctx, {
        type: chartType,
        data: {
            labels: labels,
            datasets: [{
                label: 'Number of Tasks',
                data: data,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}