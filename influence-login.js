const ctx = document.getElementById('importanceChart').getContext('2d');

new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Unit Price', 'Holiday Season', 'Stock Level', 'Promo Code', 'Day of Week', 'Weather Index'],
        datasets: [{
            label: 'Influence Score (%)',
            data: [42, 28, 15, 8, 5, 2], // Example importance weights
            backgroundColor: '#358efb',
            borderRadius: 5,
        }]
    },
    options: {
        indexAxis: 'y', // Makes the bar chart horizontal
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false }
        },
        scales: {
            x: { 
                beginAtZero: true,
                max: 50,
                title: { display: true, text: 'Importance Weight (%)' }
            }
        }
    }
});