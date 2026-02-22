/**
 * DATA-MANAGE.JS
 * Purpose: Automatically populates any dashboard page using data from LocalStorage.
 */

// 1. Main function to update the UI based on the current page's elements
function populateUI(data) {
    // --- GLOBAL SUMMARY ELEMENTS (Homepage) ---
    const accuracyBox = document.getElementById('accuracy');
    const bundleBox = document.getElementById('bundle');
    const sellerBox = document.getElementById('seller');
    const forecastedBox = document.getElementById('forecasted');

    if (accuracyBox && data.summaries) accuracyBox.innerText = data.summaries.accuracy + "%";
    if (bundleBox && data.summaries) bundleBox.innerText = data.summaries.top_pair;
    if (sellerBox && data.summaries) sellerBox.innerText = data.summaries.primary_driver;
    if (forecastedBox && data.summaries) {
        const numSpan = forecastedBox.querySelector('.number');
        if (numSpan) numSpan.innerText = data.summaries.total_forecast;
    }

    // --- FORECASTER PAGE ELEMENTS ---
    const graphContainer = document.getElementById('projection-graph');
    const accuracyValue = document.querySelector('.accuracy-value');
    
    if (accuracyValue && data.forecast) accuracyValue.innerText = data.forecast.accuracy;
    
    if (graphContainer && data.forecast) {
        graphContainer.innerHTML = `<iframe id="forecast-iframe" src="${data.forecast.graph}" style="width:100%; height:500px; border:none;"></iframe>`;
        // Setup the SARIMA/Prophet toggles if they exist
        if (typeof setupToggles === "function") setupToggles();
    }

    // Update Chart.js Year-over-Year if the function is available
    if (window.updateYoYChart && data.forecast && data.forecast.yoy) {
        window.updateYoYChart(data.forecast.yoy);
    }
}

// 2. Logic to load data from browser memory
function loadDashboard() {
    const rawData = localStorage.getItem("masterAIData");
    
    if (!rawData) {
        console.warn("AI data not ready yet... redirected to upload or showing placeholders.");
        return;
    }

    try {
        const allData = JSON.parse(rawData);
        populateUI(allData);
        console.log("Dashboard populated successfully from LocalStorage.");
    } catch (err) {
        console.error("Failed to parse AI data:", err);
    }
}

// 3. Helper for the Forecaster Toggles
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
    sendToggle(prophetBtn, 'AI Forecast (Prophet)');
}

// Initialize when the DOM is ready
document.addEventListener('DOMContentLoaded', loadDashboard);