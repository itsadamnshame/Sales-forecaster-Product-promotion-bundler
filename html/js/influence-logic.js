document.addEventListener("DOMContentLoaded", () => {
    // Temporarily hardcode this to test the chart!
    const targetFilename = "1770129962785-Sales_2022 to 2025.xlsx";
    
    // 2. Failsafe: If they navigated here without uploading a file first
    if (!targetFilename) {
        document.getElementById('top-influence-driver').innerText = "No Data";
        document.getElementById('dynamic-insight-text').innerHTML = `<span style="color: #e74c3c;">Please return to the Dashboard Home and upload your Excel dataset first.</span>`;
        return;
    }

    // 3. Run the AI analysis on the uploaded file
    loadInfluenceFactors(targetFilename);
});

async function loadInfluenceFactors(filename) {
    try {
        // Fetch the real Random Forest data from your FastAPI backend
        const response = await fetch(`http://127.0.0.1:8000/influence/${filename}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Extract the labels and scores to feed to Chart.js
        const dynamicLabels = data.influences.map(item => item.factor);
        const dynamicScores = data.influences.map(item => item.influence_score);

        // Render the Chart.js graph
        const ctx = document.getElementById('importanceChart').getContext('2d');
        
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: dynamicLabels, // Live AI labels from Python
                datasets: [{
                    label: 'Influence Score (%)',
                    data: dynamicScores,   // Live AI math from Python
                    backgroundColor: '#358efb',
                    borderRadius: 5,
                }]
            },
            options: {
                indexAxis: 'y', 
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: { 
                        beginAtZero: true,
                        // Dynamically set max width to the highest score + 10% for breathing room
                        max: Math.ceil(Math.max(...dynamicScores)) + 10, 
                        title: { display: true, text: 'Importance Weight (%)' }
                    }
                }
            }
        });

        // Update the side panel HTML with the winning driver insight
        document.getElementById('top-influence-driver').innerText = data.top_factor;
        document.getElementById('dynamic-insight-text').innerHTML = `Your historical data shows that <strong>${data.top_factor}</strong> has a commanding <strong>${dynamicScores[0]}%</strong> impact on sales volume, overriding other variables tested by the Random Forest algorithm.`;

    } catch (error) {
        console.error("Failed to load influence factors:", error);
        
        // Failsafe in case the Python server crashes or is offline
        document.getElementById('top-influence-driver').innerText = "System Error";
        document.getElementById('dynamic-insight-text').innerHTML = `<span style="color: red;">Could not connect to the AI backend. Please ensure your FastAPI server is running.</span>`;
    }
}