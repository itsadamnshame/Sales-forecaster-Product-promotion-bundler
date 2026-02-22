let yoyChart; 

async function updateDashboard(filename) {
    try {
        // 1. Fetch the pre-computed results instead of running the model
        const response = await fetch(`http://127.0.0.1:8000/get-results/${filename}`);
        const cache = await response.json();
        const data = cache.forecast; // Access the forecast section

        const accuracyEl = document.querySelector('.accuracy-value');
        const winningLabel = document.getElementById('winning-model-label');
        const insightEl = document.getElementById('model-insight-text');
        const graphContainer = document.getElementById('projection-graph');
        const dateRangeEl = document.getElementById('projection-dates');

        // 2. Update the UI with cached data
        if (dateRangeEl && data.yoy.labels.length > 0) {
            dateRangeEl.innerText = `${data.yoy.labels[0]} - ${data.yoy.labels[data.yoy.labels.length - 1]}, 2026`;
        }

        if (winningLabel) {
            winningLabel.innerHTML = `Winning Model: <strong style="color: #2ecc71;">Prophet AI</strong>`;
        }

        if (accuracyEl) accuracyEl.innerText = data.accuracy;

        if (insightEl) {
            const isIncreasing = data.yoy.current[0] > data.yoy.previous[0];
            insightEl.innerHTML = `
                <div style="margin-bottom: 10px;">
                    <strong>Performance Analysis:</strong><br>
                    Prophet AI successfully identified complex seasonal patterns across the historical dataset.
                </div>
                <div>
                    <strong>Market Trend:</strong><br>
                    Current forecasts indicate a <strong>${isIncreasing ? 'growth' : 'stabilization'}</strong> 
                    trend compared to the previous period.
                </div>
            `;
        }
        
        if (graphContainer) {
            graphContainer.innerHTML = `<iframe id="forecast-iframe" src="${data.graph}" style="width:100%; height:500px; border:none;"></iframe>`;
            setupToggles();
        }

        if (typeof updateYoYChart === "function") {
            updateYoYChart(data.yoy);
        }
    } catch (error) {
        console.error("Dashboard cache load failed:", error);
    }
}

function setupToggles() {
    const sarimaBtn = document.getElementById('toggle-sarima');
    const prophetBtn = document.getElementById('toggle-prophet');
    const iframe = document.getElementById('forecast-iframe');
    if (!iframe) return;

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
    sendToggle(prophetBtn, 'AI Forecast (Prophet)');
}