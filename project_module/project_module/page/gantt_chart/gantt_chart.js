frappe.pages['gantt-chart'].on_page_load = function(wrapper) {
	var page = frappe.ui.make_app_page({
		parent: wrapper,
		title: 'Gantt',
		single_column: true
	});

	var html_context = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gantt Chart - MS Project Style</title>
    <link href="https://cdn.jsdelivr.net/npm/frappe-gantt@0.5.0/dist/frappe-gantt.css" rel="stylesheet">
    
    <style>
        body {
            font-family: Arial, sans-serif;
        }
        .flex-container {
            display: flex;
            height: 500px;
            width: 100%;
            overflow: hidden;
        }
        .task-list {
            width: 30%;
            border-right: 1px solid #ccc;
            padding: 10px;
            overflow-y: auto;
        }
        .task-list table {
            width: 100%;
            border-collapse: collapse;
        }
        .task-list th, .task-list td {
            padding: 8px;
            border: 1px solid #ccc;
        }
        .gantt-container {
            width: 70%;
            padding: 10px;
            overflow-x: auto;
        }
        .tabs {
            margin-bottom: 10px;
        }
        .tabs button {
            padding: 10px;
            cursor: pointer;
        }
        .tab-content {
            display: none;
        }
        .tab-content.active {
            display: flex;
        }
    </style>
</head>
<body>
    <h1>Gantt Chart</h1>
    <div class="tabs">
        <button onclick="showTab('day')">Day View</button>
        <button onclick="showTab('month')">Month/Week View</button>
    </div>

    <div class="tab-content active" id="day">
        <div class="flex-container">
            <!-- Task List -->
            <div class="task-list">
                <table>
                    <thead>
                        <tr>
                            <th>Task</th>
                            <th>Start</th>
                            <th>End</th>
                            <th>Progress</th>
                        </tr>
                    </thead>
                    <tbody id="task-table-day">
                    </tbody>
                </table>
            </div>
            <!-- Gantt Chart -->
            <div class="gantt-container">
                <div id="gantt-chart-day"></div>
            </div>
        </div>
    </div>

    <div class="tab-content" id="month">
        <div class="flex-container">
            <!-- Task List -->
            <div class="task-list">
                <table>
                    <thead>
                        <tr>
                            <th>Task</th>
                            <th>Start</th>
                            <th>End</th>
                            <th>Progress</th>
                        </tr>
                    </thead>
                    <tbody id="task-table-month">
                    </tbody>
                </table>
            </div>
            <!-- Gantt Chart -->
            <div class="gantt-container">
                <div id="gantt-chart-month"></div>
            </div>
        </div>
    </div>
</body>
</html>
`;
page.body.html(html_context);

        const tasks = [
            {
                id: 'Task 1',
                name: 'Design Phase',
                start: '2024-01-01',
                end: '2024-01-15',
                progress: 50,
                dependencies: ''
            },
            {
                id: 'Task 2',
                name: 'Development Phase',
                start: '2024-01-16',
                end: '2024-02-28',
                progress: 20,
                dependencies: 'Task 1'
            },
            {
                id: 'Task 3',
                name: 'Testing Phase',
                start: '2024-03-01',
                end: '2024-03-15',
                progress: 0,
                dependencies: 'Task 2'
            },
            {
                id: 'Task 4',
                name: 'Deployment',
                start: '2024-03-16',
                end: '2024-03-20',
                progress: 0,
                dependencies: 'Task 3'
            }
        ];

        function populateTable(tableId) {
            const taskTable = document.getElementById(tableId);
            tasks.forEach(task => {
                const row = `<tr>
                                <td>${task.name}</td>
                                <td>${task.start}</td>
                                <td>${task.end}</td>
                                <td>${task.progress}%</td>
                            </tr>`;
                taskTable.innerHTML += row;
            });
        }

        function initGantt(chartId, viewMode) {
            new Gantt(`#${chartId}`, tasks, {
                view_mode: viewMode,
                on_click: task => console.log(task),
                on_date_change: (task, start, end) => console.log(task, start, end),
                on_progress_change: (task, progress) => console.log(task, progress),
                on_view_change: mode => console.log(mode)
            });
        }

        window.showTab = function(tab) {
            document.querySelectorAll('.tab-content').forEach(tabContent => {
                tabContent.classList.remove('active');
            });
            document.getElementById(tab).classList.add('active');
        }

        populateTable('task-table-day');
        populateTable('task-table-month');
        initGantt('gantt-chart-day', 'Day');
        initGantt('gantt-chart-month', 'Month');
}
