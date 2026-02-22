function updateYoYChart(yoyData) {
    const ctx = document.getElementById('yoyChart').getContext('2d');
    if (window.yoyChartInstance) { window.yoyChartInstance.destroy(); }

    window.yoyChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: yoyData.labels,
            datasets: [{
                label: '2026 Forecast',
                data: yoyData.current,
                borderColor: '#2ecc71',
                backgroundColor: 'rgba(46, 204, 113, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 4
            }, {
                label: '2025 Actual',
                data: yoyData.previous,
                borderColor: '#bdc3c7',
                borderDash: [5, 5],
                fill: false,
                tension: 0.4,
                pointRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false } // We use the custom buttons instead
            },
            scales: {
                y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#bdc3c7' } },
                x: { grid: { display: false }, ticks: { color: '#bdc3c7' } }
            }
        }
    });
}