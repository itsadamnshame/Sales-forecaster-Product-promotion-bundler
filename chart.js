const yoyCtx = document.getElementById('yoyChart').getContext('2d');

new Chart(yoyCtx, {
    type: 'line',
    data: {
        labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
        datasets: [{
            label: 'Current Year (2026)',
            data: [1500, 1600, 1550, 1900, 2100, 2400, 2300],
            borderColor: '#358efb',
            fill: false,
            tension: 0.3
        }, {
            label: 'Previous Year (2025)',
            data: [1300, 1450, 1400, 1700, 1950, 2200, 2100],
            borderColor: 'rgba(255, 255, 255, 0.3)', // Faded line for the past
            borderDash: [10, 5],
            fill: false,
            tension: 0.3
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { labels: { color: '#112c4f' } }
        }
    }
});