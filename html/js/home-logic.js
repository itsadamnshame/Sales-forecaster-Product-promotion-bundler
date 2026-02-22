document.addEventListener("DOMContentLoaded", () => {
    const filename = localStorage.getItem("uploadedFilename");
    if (filename) {
        displaySummaries(filename);
    }
});

async function displaySummaries(filename) {
    try {
        const response = await fetch(`http://127.0.0.1:8000/get-results/${filename}`);
        const cache = await response.json();

        // 1. Update Forecast Summary
        const forecastVal = cache.forecast.yoy.current.reduce((a, b) => a + b, 0);
        document.querySelector('#forecasted .number').innerText = Math.round(forecastVal).toLocaleString();

        // 2. Update Accuracy Summary
        document.querySelector('#accuracy .number').innerText = cache.forecast.accuracy;

        // 3. Update Apriori Summary (Top Pair)
        const topPair = cache.market.bundles[0];
        document.querySelector('#bundle .number').innerText = `${topPair.item_a} & ${topPair.item_b}`;

        // 4. Update Random Forest Summary (Top Driver)
        document.querySelector('#seller .number').innerText = cache.influence.top;

    } catch (error) {
        console.error("Dashboard summary load failed:", error);
    }
}