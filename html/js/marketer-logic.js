document.addEventListener("DOMContentLoaded", () => {
    const targetFilename = localStorage.getItem("uploadedFilename");
    if (targetFilename) loadMarketAnalysis(targetFilename);
});

async function loadMarketAnalysis(filename) {
    const container = document.getElementById('bundle-results-container');
    try {
        const response = await fetch(`http://127.0.0.1:8000/get-results/${filename}`);
        const cache = await response.json();
        const data = cache.market; // Access the market section

        container.innerHTML = ""; // Clear loader
        data.bundles.forEach(bundle => {
            const card = `
                <div class="bundle-card">
                    <h4>Best Bundle Pair</h4>
                    <p><strong>${bundle.item_a}</strong> + <strong>${bundle.item_b}</strong></p>
                    <div class="confidence-tag">Confidence: ${bundle.confidence}</div>
                </div>
            `;
            container.innerHTML += card;
        });

        document.getElementById('total-tx-label').innerText = data.total.toLocaleString();
    } catch (error) {
        console.error("Market cache load failed:", error);
    }
}