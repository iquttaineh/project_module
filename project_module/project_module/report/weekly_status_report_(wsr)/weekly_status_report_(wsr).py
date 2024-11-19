from frappe import _ 
import frappe
from frappe.utils.jinja import render_template

def execute(filters=None):
    # Define columns for your report
    columns = [
        {"fieldname": "name", "label": _("Project Name"), "fieldtype": "Data", "width": 150}
    ]

    # Fetch data from the Project doctype
    data = frappe.db.get_list(
        "Project",
        fields=["name", "status"],
        filters=filters or {}
    )

    # # Debug output
    # print("Columns:", columns)
    # print("Data:", data)

    # Create a Jinja2 template for rendering the HTML
    template = """
<body>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    
<style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 20px;
        }

        .dashboard {
            background-color: white;
            border-radius: 10px;
            padding: 20px;
            max-width: 1200px;
            margin: auto;
        }

        .stats, .charts, .metrics, .survey {
            display: flex;
            justify-content: space-between;
            padding-bottom: 20px;
        }

        .stat-item, .metric-item, .survey-item {
            background-color: #f7f9fc;
            border-radius: 10px;
            text-align: center;
            padding: 20px;
        }

        .stats .stat-item, .metrics .metric-item, .survey .survey-item {
            width: 23%;
        }

        .chart-item {
            width: 49%; /* Smaller chart size */
			
            background-color: #f7f9fc;
            border-radius: 10px;
            padding: 10px;
			
        }
		
		
		
		#sourceChart {
    width: 49% !important; /* Smaller size for the pie chart */
    margin: auto; /* Center the smaller pie chart */
}
		
		

        /* Table Styles */
        table {
            width: 100%;
            margin-bottom: 20px;
            border-collapse: collapse;
        }

        th, td {
            padding: 10px;
            text-align: left;
            border: 1px solid #ddd;
        }
		
		

        th {
            background-color: #f7f9fc;
        }

        .small-table {
            width: 32%;
        }
		
		/* Table Styling */
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.1);
    }
	
	tbody tr:hover {
      background-color: #024CAA;
      color: #fff;
    }
	
	tr:nth-child(even) {
      background-color: #ecf0f1;
    }

    tr:nth-child(odd) {
      background-color: #ffffff;
    }
	
	.issues th {
      background-color: #2980b9;
      color: #fff;
	  padding: 5px;
            text-align: Center;
            border: 1px solid #ddd;
			font-size:Small;
    }
	
	.risks th {
      background-color: #e74c3c;
      color: #fff;
	  padding: 5px;
            text-align: Center;
            border: 1px solid #ddd;
			font-size:Small;
    }
	
	.tasks th {
      background-color: #27ae60;
      color: #fff;
	  padding: 5px;
            text-align: Center;
            border: 1px solid #ddd;
			font-size:Small;
    }
	
	.issues td {
      			font-size:Small;
    }
	
	.risks td {
     font-size:Small;
    }
	
	.tasks td {
      font-size:Small;
    }
	
	.poject_info tr {
      background-color: #ecf0f1;
    }
	
	
	/* Flex layout for tables */
        .table-container {
            display: flex;
            justify-content: space-between;
        }

        .small-table {
            width: 32%;
        }

        

       

        

        .issues td,
        .risks td,
        .tasks td {
            font-size: small;
        }

        /* Expandable row styling */
        .hidden-rows {
            display: none;
        }

        .expand-button {
            margin-top: 10px;
            background-color: #3498db;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 5px;
            cursor: pointer;
        }
    </style>


    <div class="dashboard">
	
<h2 style="color:rgb(38, 172, 217);padding-bottom:15px;">Weekly Status Report (WSR)</h2>

		<!-- Project Info Table -->
        <h4 style="color:#004d66; display: inline-block;">Project Information</h4>
		<span style="float: right; color:orange;">
		<span style="color:#004d66;">From: </span>
		<span style="font-weight:bold;">2024-10-05</span>
		<span  style="color:#004d66;">To: </span>
		<span style="font-weight:bold;">2024-10-11</span>
		</span>
		
  
	  <table class="poject_info">
	  <tbody >
		<tr>
		  <td><b>Project Name: </b>Project Alpha</td>
		  <td><b>Project Manager Name: </b>Jibreel Abdeen</td>
		</tr>
		<tr>
		  <td><b>Customer Name: </b>Bank al-Etihad</td>
		  <td><b>Expected End Date: </b>2024-10-31</td>
		</tr>
		<tr>
		  <td><b>Project Status: </b>In Progress</td>
		  <td><b>% Completed: </b>40%</td>
		</tr>
		</tbody>
	  </table>
  


        <!-- Header -->
        <h4 style="color:#004d66;">Priority Overview</h4>

        <!-- Stats -->
        <div class="stats">
            <div class="stat-item">
                <h3 style="color:red;">26</h3>
                <p>Urgent</p>
            </div>
            <div class="stat-item">
                <h3 style="color:orange;">7</h3>
                <p>High</p>
            </div>
            <div class="stat-item">
                <h3 style="color:blue;">5</h3>
                <p>Medium</p>
            </div>
            <div class="stat-item">
                <h3 style="color:green;">74</h3>
                <p>Low</p>
            </div>
        </div>

        <!-- Charts -->
        <div class="charts">
            <div class="chart-item">
                <h4 style="color:#004d66;">Work Left To Do vs. Time</h4>
                <canvas id="funnelChart"></canvas>
            </div>
            <div class="chart-item">
                <h4 style="color:#004d66;">Overall Progress</h4>
                <canvas id="timelineChart"></canvas>
            </div>
            
        </div>
		<div class="charts">
            
            <div class="chart-item">
                <h4 style="color:#004d66;">Task Status Distribution</h4>
                <canvas id="sourceChart"></canvas>
            </div>
			<div class="chart-item">
                <h4 style="color:#004d66;">Resource Allocation</h4>
                <canvas id="funnelChart2"></canvas>
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
                            <th>Task</th>
                            <th>Priority</th>
                            <th>Expected End Date</th>
                            <th>% Completed</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Screen Applications</td>
                            <td>High</td>
                            <td>2024-10-30</td>
                            <td>In Progress bhjbhkbh</td>
                        </tr>
                        <tr>
                            <td>Conduct Interviews</td>
                            <td>Medium</td>
                            <td>2024-11-05</td>
                            <td>Not Started</td>
                        </tr>
                        <tr>
                            <td>Send Offers</td>
                            <td>Low</td>
                            <td>2024-11-12</td>
                            <td>Not Started</td>
                        </tr>
                        <tr class="hidden-rows">
                            <td>Follow Up</td>
                            <td>High</td>
                            <td>2024-11-15</td>
                            <td>Not Started</td>
                        </tr>
						<tr class="hidden-rows">
                            <td>Follow Up</td>
                            <td>High</td>
                            <td>2024-11-15</td>
                            <td>Not Started</td>
                        </tr>
						<tr class="hidden-rows">
                            <td>Follow Up</td>
                            <td>High</td>
                            <td>2024-11-15</td>
                            <td>Not Started</td>
                        </tr>
						<tr class="hidden-rows">
                            <td>Follow Up</td>
                            <td>High</td>
                            <td>2024-11-15</td>
                            <td>Not Started</td>
                        </tr>
						<tr class="hidden-rows">
                            <td>Follow Up</td>
                            <td>High</td>
                            <td>2024-11-15</td>
                            <td>Not Started</td>
                        </tr>
						<tr class="hidden-rows">
                            <td>Follow Up</td>
                            <td>High</td>
                            <td>2024-11-15</td>
                            <td>Not Started</td>
                        </tr>
						<tr class="hidden-rows">
                            <td>Follow Up</td>
                            <td>High</td>
                            <td>2024-11-15</td>
                            <td>Not Started</td>
                        </tr>
						<tr class="hidden-rows">
                            <td>Follow Up</td>
                            <td>High</td>
                            <td>2024-11-15</td>
                            <td>Not Started</td>
                        </tr>
						<tr class="hidden-rows">
                            <td>Follow Up</td>
                            <td>High</td>
                            <td>2024-11-15</td>
                            <td>Not Started</td>
                        </tr>
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
                            <th>Date</th>
                            <th>Risk</th>
                            <th>Priority</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Low Candidate Quality</td>
                            <td>High</td>
                            <td>Medium</td>
                            <td>Improve sourcing strategies</td>
                        </tr>
                        <tr>
                            <td>Delay in Offer Acceptance</td>
                            <td>Medium</td>
                            <td>High</td>
                            <td>Enhance communication with candidates</td>
                        </tr>
                        <tr class="hidden-rows">
                            <td>Budget Overrun</td>
                            <td>High</td>
                            <td>High</td>
                            <td>Revise budget plan</td>
                        </tr>
						<tr class="hidden-rows">
                            <td>Budget Overrun</td>
                            <td>High</td>
                            <td>High</td>
                            <td>Revise budget plan</td>
                        </tr>
						<tr class="hidden-rows">
                            <td>Budget Overrun</td>
                            <td>High</td>
                            <td>High</td>
                            <td>Revise budget plan</td>
                        </tr>
						<tr class="hidden-rows">
                            <td>Budget Overrun</td>
                            <td>High</td>
                            <td>High</td>
                            <td>Revise budget plan</td>
                        </tr>
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
                            <th>Date</th>
                            <th>Issue</th>
                            <th>Priority</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Technical Issues with Application System</td>
                            <td>High</td>
                            <td>2024-10-20</td>
                            <td>Resolved</td>
                        </tr>
                        <tr>
                            <td>Delayed Feedback from Hiring Managers</td>
                            <td>Medium</td>
                            <td>2024-10-18</td>
                            <td>Open</td>
                        </tr>
                        <tr class="hidden-rows">
                            <td>System Downtime</td>
                            <td>High</td>
                            <td>2024-10-22</td>
                            <td>Resolved</td>
                        </tr>
						<tr class="hidden-rows">
                            <td>System Downtime</td>
                            <td>High</td>
                            <td>2024-10-22</td>
                            <td>Resolved</td>
                        </tr>
						<tr class="hidden-rows">
                            <td>System Downtime</td>
                            <td>High</td>
                            <td>2024-10-22</td>
                            <td>Resolved</td>
                        </tr>
						<tr class="hidden-rows">
                            <td>System Downtime</td>
                            <td>High</td>
                            <td>2024-10-22</td>
                            <td>Resolved</td>
                        </tr>
						<tr class="hidden-rows">
                            <td>System Downtime</td>
                            <td>High</td>
                            <td>2024-10-22</td>
                            <td>Resolved</td>
                        </tr>
						<tr class="hidden-rows">
                            <td>System Downtime</td>
                            <td>High</td>
                            <td>2024-10-22</td>
                            <td>Resolved</td>
                        </tr>
                    </tbody>
                </table>
                <button class="expand-button" onclick="toggleRows(this)">Show More</button>
            </div>
        </div>
    </div>
	
	
		<script>
        function toggleRows(button) {
            const rows = button.previousElementSibling.querySelectorAll('.hidden-rows');
            rows.forEach(row => row.style.display = row.style.display === 'table-row' ? 'none' : 'table-row');

            if (button.textContent === 'Show More') {
                button.textContent = 'Show Less';
            } else {
                button.textContent = 'Show More';
            }
        }
    </script>

    <script>
        // Recruitment Funnel Chart
        const funnelCtx = document.getElementById('funnelChart').getContext('2d');
        const funnelChart = new Chart(funnelCtx, {
            type: 'line',
            data: {
                labels: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
                datasets: [{
                    label: 'Percentage Left (%)',
                    data: [100, 88, 76, 60, 51, 43, 33, 28, 20, 10, 5, 0],
                    backgroundColor: 'rgba(54, 162, 235, 0.6)',
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

        // Recruitment Timeline Chart
        const timelineCtx = document.getElementById('timelineChart').getContext('2d');
        const timelineChart = new Chart(timelineCtx, {
            type: 'bar',
            data: {
                labels: ['Task1', 'Task2', 'Task3', 'Task4', 'Task5', 'Task6'],
                datasets: [{
                    label: '% Completed',
                    data: [50, 70, 100, 40, 30, 20],
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

        // Application Sources Chart
        const sourceCtx = document.getElementById('sourceChart').getContext('2d');
        const sourceChart = new Chart(sourceCtx, {
            type: 'pie',
            data: {
                labels: ['Open', 'Working', 'Pending Review', 'Overdue', 'Completed', 'Cancelled'],
                datasets: [{
                    data: [45, 25, 15, 10, 5, 6],
                    backgroundColor: [
                        'rgba(75, 192, 192, 0.6)',
                        'rgba(153, 102, 255, 0.6)',
                        'rgba(255, 159, 64, 0.6)',
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(54, 162, 235, 0.6)',
						'rgba(255, 255, 130, 0.6)'
                    ]
                }]
            }
        });
		
		// Recruitment Funnel Chart
        const funnelCtx2 = document.getElementById('funnelChart2').getContext('2d');
        const funnelChart2 = new Chart(funnelCtx2, {
            type: 'bar',
            data: {
                labels: ['Ishaq', 'Jibreel', 'Jameel', 'Yaser', 'Samer', 'Rami'],
                datasets: [{
                    label: 'Number of Tasks',
                    data: [100, 77, 67, 43, 29, 22],
                    backgroundColor: 'rgba(54, 162, 235, 0.6)',
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
    </script>
</body>
    """

    # Render the template with data
    rendered_html = render_template(template, {"data": data, "columns": columns})

    # Return the columns, data, and rendered HTML
    return columns, data, rendered_html
