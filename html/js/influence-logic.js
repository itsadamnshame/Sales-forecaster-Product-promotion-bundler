document.addEventListener("DOMContentLoaded", () => {
    const targetFilename = localStorage.getItem("uploadedFilename"); 
    if (!targetFilename) {
        document.getElementById('top-influence-driver').innerText = "No Data";
        return;
    }
    loadInfluenceFactors(targetFilename);
});

async function loadInfluenceFactors(filename) {
    try {
        const response = await fetch(`http://127.0.0.1:8000/get-results/${filename}`);
        const cache = await response.json();
        const data = cache.influence; // Access the influence section

        const dynamicLabels = data.list.map(item => item.factor);
        const dynamicScores = data.list.map(item => item.score);

        const ctx = document.getElementById('importanceChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: dynamicLabels,
                datasets: [{
                    label: 'Influence Score (%)',
                    data: dynamicScores,
                    backgroundColor: '#358efb',
                    borderRadius: 5,
                }]
            },
            options: {
                indexAxis: 'y', 
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { 
                        beginAtZero: true,
                        max: Math.ceil(Math.max(...dynamicScores)) + 10, 
                        title: { display: true, text: 'Importance Weight (%)' }
                    }
                }
            }
        });

        document.getElementById('top-influence-driver').innerText = data.top;
        document.getElementById('dynamic-insight-text').innerHTML = 
            `Your data shows <strong>${data.top}</strong> has a <strong>${dynamicScores[0]}%</strong> impact on sales volume.`;

    } catch (error) {
        console.error("Influence cache load failed:", error);
    }
}