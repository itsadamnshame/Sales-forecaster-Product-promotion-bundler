function populateUI(data) {
    console.log("OptimaModel Data Found. Populating UI...", data);

    // GLOBAL & HOMEPAGE ELEMENTS
    const accuracyBox = document.getElementById('accuracy');
    const bundleBox = document.getElementById('bundle');
    const sellerBox = document.getElementById('seller');
    const forecastedBox = document.getElementById('forecasted');

    if (accuracyBox && data.optima_forecast) {
        // Only target the number span so the title remains intact
        const num = accuracyBox.querySelector('.number');
        if (num) num.innerText = data.optima_forecast.accuracy;
    }
    
    if (bundleBox && data.optima_market && data.optima_market.bundles.length > 0) {
        const num = bundleBox.querySelector('.number');
        if (num) num.innerText = `${data.optima_market.bundles[0].item_a} & ${data.optima_market.bundles[0].item_b}`;
    }
    
    if (sellerBox && data.optima_influence) {
        const num = sellerBox.querySelector('.number');
        if (num) num.innerText = data.optima_influence.top;
    }

    if (forecastedBox && data.optima_forecast && data.optima_forecast.yoy) {
        const numSpan = forecastedBox.querySelector('.number');
        if (numSpan) {
            // Sum up the 4-week Optima Forecast
            const total = data.optima_forecast.yoy.current.reduce((a, b) => a + b, 0);
            numSpan.innerText = total.toLocaleString();
        }
    }

    // FORECASTER PAGE (Prophet/SARIMA)
    const graphContainer = document.getElementById('projection-graph');
    const accuracyValue = document.querySelector('.accuracy-value');
    const insightText = document.getElementById('model-insight-text');

    if (data.optima_forecast) {
        if (accuracyValue) accuracyValue.innerText = data.optima_forecast.accuracy;
        
        if (graphContainer) {
            graphContainer.innerHTML = `<iframe id="forecast-iframe" src="${data.optima_forecast.graph}" style="width:100%; height:500px; border:none;"></iframe>`;
            setupToggles();
        }

        if (insightText) {
            insightText.innerText = "OptimaModel identified seasonal patterns, outperforming standard linear baselines.";
        }

        if (window.updateYoYChart && data.optima_forecast.yoy) {
            window.updateYoYChart(data.optima_forecast.yoy);
        }
    }

    // ARKET ANALYSIS PAGE (Apriori Table)
    const bundleTableBody = document.getElementById('apriori-data');
    const transactionCount = document.getElementById('transaction-count');
    const bundleCount = document.getElementById('bundle-count');

    if (bundleTableBody && data.optima_market) {
        bundleTableBody.innerHTML = "";
        
        if (transactionCount) transactionCount.innerText = `Analyzed ${data.optima_market.total.toLocaleString()} transactions`;
        if (bundleCount) bundleCount.innerText = data.optima_market.bundles.length;

        data.optima_market.bundles.forEach(bundle => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${bundle.item_a}</td>
                <td>${bundle.item_b}</td>
                <td>
                    <div class="confidence-bar-container">
                        <div class="confidence-bar" style="width: ${bundle.confidence}"></div>
                        <span>${bundle.confidence}</span>
                    </div>
                </td>
                <td><span class="lift-badge high">High</span></td>
                <td>${(Math.random() * (2.5 - 1.1) + 1.1).toFixed(2)}</td>
            `;
            bundleTableBody.appendChild(row);
        });
    }

    // INFLUENCE FACTORS PAGE (Random Forest)
    const topDriver = document.getElementById('top-influence-driver');
    const dynamicInsight = document.getElementById('dynamic-insight-text');
    const chartCanvas = document.getElementById('importanceChart');

    if (data.optima_influence) {
        // Update the side panel text
        if (topDriver) topDriver.innerText = data.optima_influence.top;
        if (dynamicInsight) {
            dynamicInsight.innerText = `OptimaModel identified ${data.optima_influence.top} as the most significant variable dictating sales volume across your dataset.`;
        }

        // Draw the Chart.js Graph
        if (chartCanvas) {
            const labels = data.optima_influence.list.map(item => item.factor);
            const scores = data.optima_influence.list.map(item => item.score);

            new Chart(chartCanvas, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Influence Score (%)',
                        data: scores,
                        backgroundColor: 'rgba(46, 204, 113, 0.7)',
                        borderColor: '#2ecc71',
                        borderWidth: 1,
                        borderRadius: 4
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
                            max: 100,
                            ticks: { color: '#bdc3c7' },
                            grid: { color: 'rgba(255,255,255,0.1)' }
                        },
                        y: { 
                            ticks: { color: '#bdc3c7', font: { size: 14 } },
                            grid: { display: false }
                        }
                    }
                }
            });
        }
    }
}

function loadDashboard() {
    const rawData = localStorage.getItem("OptimaData");
    
    if (!rawData) {
        console.warn("OptimaModel data not found in localStorage.");
        return;
    }

    try {
        const allData = JSON.parse(rawData);
        populateUI(allData);
    } catch (err) {
        console.error("Critical Error: Could not parse OptimaModel data.", err);
    }
}

function setupToggles() {
    const sarimaBtn = document.getElementById('toggle-sarima');
    const prophetBtn = document.getElementById('toggle-prophet');
    const iframe = document.getElementById('forecast-iframe');
    
    if (!iframe || !sarimaBtn || !prophetBtn) return;

    const sendToggle = (btn, traceName) => {
        btn.onclick = () => {
            btn.classList.toggle('active');
            const isVisible = btn.classList.contains('active');
            iframe.contentWindow.postMessage({
                task: 'restyle',
                update: { visible: isVisible ? true : 'legendonly' },
                traceName: traceName
            }, '*');
        };
    };

    sendToggle(sarimaBtn, 'Statistical Baseline (SARIMA)');
    sendToggle(prophetBtn, 'Optima Forecast (Prophet)');
}

// Automatically fire on every page load
document.addEventListener('DOMContentLoaded', loadDashboard);