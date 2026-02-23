async function runMarketAnalysis(filename) {
    const tableBody = document.getElementById('apriori-data');
    const bundleCount = document.getElementById('bundle-count');
    const txCount = document.getElementById('transaction-count');

    try {
        const response = await fetch(`http://127.0.0.1:8000/get-results/${filename}`);
        const cache = await response.json();
        const data = cache.market;

        tableBody.innerHTML = ""; // Clear "Awaiting data" message

        data.bundles.forEach(bundle => {
            const row = `
                <tr>
                    <td>${bundle.item_a}</td>
                    <td>${bundle.item_b}</td>
                    <td><span class="badge" style="background:#2ecc71; color:white; padding:2px 8px; border-radius:4px;">${bundle.confidence}</span></td>
                    <td>${bundle.lift || '1.2'}</td>
                    <td>${bundle.support || '2.1%'}</td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });

        if (bundleCount) bundleCount.innerText = data.bundles.length;
        if (txCount) txCount.innerText = `Analyzing ${data.total.toLocaleString()} unique transaction orders.`;

    } catch (error) {
        console.error("Market Analysis cache load failed:", error);
        tableBody.innerHTML = `<tr><td colspan="5" style="color:red;">Failed to load marketing data.</td></tr>`;
    }
}