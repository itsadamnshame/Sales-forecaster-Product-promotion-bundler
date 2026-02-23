document.addEventListener("DOMContentLoaded", () => {
    const filename = localStorage.getItem("uploadedFilename") || '1770129962785-Sales_2022 to 2025.xlsx';
    displaySummaries(filename);
});

async function displaySummaries(filename) {
    try {
        const response = await fetch(`http://127.0.0.1:8000/get-results/${filename}`);
        const cache = await response.json();

        // 1. Forecasted Units (Sum of next 4 weeks)
        const totalUnits = cache.forecast.yoy.current.reduce((a, b) => a + b, 0);
        document.querySelector('#forecasted .number').innerText = Math.round(totalUnits).toLocaleString();

        // 2. Accuracy
        document.querySelector('#accuracy .number').innerText = cache.forecast.accuracy;

        // 3. Top Pair
        const pair = cache.market.bundles[0];
        document.querySelector('#bundle .number').innerText = `${pair.item_a} & ${pair.item_b}`;

        // 4. Primary Driver
        document.querySelector('#seller .number').innerText = cache.influence.top;

    } catch (error) {
        console.error("Homepage summary load failed:", error);
    }
}