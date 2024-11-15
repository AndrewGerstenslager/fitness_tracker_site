let workoutTypeChart, stepsChart, sleepChart;

// Initialize charts when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeCharts();
});

function initializeCharts() {
    workoutTypeChart = new Chart(document.getElementById('workoutTypeChart'), {
        type: 'pie',
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', 
                    '#4BC0C0', '#9966FF', '#FF9F40'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    stepsChart = new Chart(document.getElementById('stepsChart'), {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Daily Steps',
                data: [],
                backgroundColor: '#36A2EB',
                borderColor: '#2483C5',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    sleepChart = new Chart(document.getElementById('sleepChart'), {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Sleep Hours',
                data: [],
                backgroundColor: '#9966FF',
                borderColor: '#7744CC',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Add event listener for user selection
document.addEventListener('DOMContentLoaded', function() {
    // Fetch user IDs when page loads
    fetch('http://localhost:5000/get_user_ids')
        .then(response => response.json())
        .then(users => {
            const select = document.getElementById('userSelect');
            users.forEach(userId => {
                const option = document.createElement('option');
                option.value = userId;
                option.textContent = `User ${userId}`;
                select.appendChild(option);
            });
            
            // Automatically select the first user
            if (users.length > 0) {
                select.value = users[0];
                updateDashboard();
            }
        })
        .catch(error => console.error('Error fetching user IDs:', error));

    // Handle user selection changes
    document.getElementById('userSelect').addEventListener('change', updateDashboard);
});

async function updateDashboard() {
    const userId = document.getElementById('userSelect').value;
    if (!userId) return;

    try {
        const response = await fetch(`http://localhost:5000/get_user_data/${userId}`);
        const userData = await response.json();
        
        // Update workout type chart
        workoutTypeChart.data.labels = Object.keys(userData.workout_distribution);
        workoutTypeChart.data.datasets[0].data = Object.values(userData.workout_distribution);
        workoutTypeChart.update();

        // Update steps chart
        stepsChart.data.labels = userData.dates;
        stepsChart.data.datasets[0].data = userData.steps_data;
        stepsChart.update();

        // Update sleep chart
        sleepChart.data.labels = userData.dates;
        sleepChart.data.datasets[0].data = userData.sleep_data;
        sleepChart.update();

        // Update stats
        document.querySelectorAll('.stat-value')[0].textContent = Math.round(userData.avg_steps).toLocaleString();
        document.querySelectorAll('.stat-value')[1].textContent = Math.round(userData.avg_calories).toLocaleString();
        document.querySelectorAll('.stat-value')[2].textContent = userData.avg_sleep.toFixed(1);
        document.querySelectorAll('.stat-value')[3].textContent = Math.round(userData.avg_heart_rate);
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
}

