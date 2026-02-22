async function runMarketAnalysis(filename) {
    const response = await fetch(`http://127.0.0.1:8000/analyze-market/${filename}`);
    const data = await response.json();

    if (data.status === "success") {
        const container = document.getElementById('bundle-suggestions');
        container.innerHTML = ""; // Clear old data

        data.bundles.forEach(bundle => {
            const card = `
                <div class="bundle-card">
                    <div class="bundle-header">
                        <h4>Recommended Bundle</h4>
                        <span class="badge">Confidence: ${bundle.confidence}</span>
                    </div>
                    <div class="bundle-items">
                        <p><strong>${bundle.item_a}</strong> + <strong>${bundle.item_b}</strong></p>
                    </div>
                    <div class="bundle-stats">
                        <span>Lift: ${bundle.lift}</span>
                        <span>Support: ${bundle.support}</span>
                    </div>
                    <button class="btn-promo">Create Promotion</button>
                </div>
            `;
            container.innerHTML += card;
        });
    }
}

// At the bottom of marketer.html
document.addEventListener('DOMContentLoaded', () => {
    // We add a small 500ms delay to make sure the UI is ready
    setTimeout(() => {
        runMarketAnalysis('1770129962785-Sales_2022 to 2025.xlsx');
    }, 500);
});