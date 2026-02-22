/**
 * marketer-manage.js
 * Handles Market Basket Analysis (Apriori) communication and UI updates
 */

async function runMarketAnalysis(filename) {
    try {
        // 1. Fetch data from the Python FastAPI endpoint
        const response = await fetch(`http://127.0.0.1:8000/analyze-market/${filename}`);
        const data = await response.json();

        if (data.status === "success") {
            const tableBody = document.getElementById('apriori-data');
            const bundleCount = document.getElementById('bundle-count');
            const strategyText = document.getElementById('strategy-text');
            const transText = document.getElementById('transaction-count');
            const winningLabel = document.querySelector('.mini-box.highlight .title');

            // 2. Update Transaction and Bundle Counts
            if (bundleCount) bundleCount.innerText = data.bundles.length;
            if (transText) {
                transText.innerText = `Based on ${data.total_transactions.toLocaleString()} unique transactions`;
            }

            // 3. Build the Association Rules Table
            if (tableBody) {
                tableBody.innerHTML = ""; // Clear placeholders
                
                if (data.bundles.length === 0) {
                    tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">No strong associations found with current thresholds.</td></tr>`;
                } else {
                    data.bundles.forEach(bundle => {
                        const confVal = parseFloat(bundle.confidence);
                        // Apply CSS classes based on association strength
                        const strengthClass = confVal > 75 ? 'strength-high' : 'strength-med';
                        
                        tableBody.innerHTML += `
                            <tr>
                                <td><strong>${bundle.item_a}</strong></td>
                                <td><strong>${bundle.item_b}</strong></td>
                                <td class="${strengthClass}">${bundle.confidence}</td>
                                <td>${bundle.lift}x</td>
                                <td>${bundle.support}</td>
                            </tr>
                        `;
                    });
                }
            }

            // 4. Update Strategy Insight Box with the Top Result
            if (data.bundles.length > 0 && strategyText) {
                const topBundle = data.bundles[0];
                
                // Update the Highlight Box title
                if (winningLabel) {
                    winningLabel.innerHTML = `Strongest Bundle: <strong style="color: #358efb;">${topBundle.item_a}</strong>`;
                }

                // Dynamic Strategy Narrative
                strategyText.innerHTML = `
                    <div style="margin-bottom: 10px;">
                        <strong>Bundle Insight:</strong><br>
                        Customers who purchased <strong>${topBundle.item_a}</strong> show a 
                        <strong>${topBundle.confidence}</strong> probability of also buying 
                        <strong>${topBundle.item_b}</strong>.
                    </div>
                    <div>
                        <strong>Marketing Action:</strong><br>
                        Target these segments with a <em>"Frequently Bought Together"</em> 
                        discount to maximize cross-selling revenue.
                    </div>
                `;
            }
        }
    } catch (error) {
        console.error("Market analysis failed:", error);
        const tableBody = document.getElementById('apriori-data');
        if (tableBody) {
            tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; color: #e74c3c;">Error connecting to analysis server.</td></tr>`;
        }
    }
}

// Ensure the analysis runs as soon as the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Replace this filename string if your upload logic uses a different naming convention
    const activeDataset = '1770129962785-Sales_2022 to 2025.xlsx';
    runMarketAnalysis(activeDataset);
});