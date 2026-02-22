const upload = document.getElementById('upload');

if (upload) {
    upload.onsubmit = async (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        
        try {
            // 1. Upload to your Node.js server (Multer)
            const res = await fetch('http://localhost:3000/upload', {
                method: 'POST',
                body: data
            });
            const result = await res.json();
            
            if (result.filename) {
                // 2. Save the Multer-generated filename for other pages to use
                localStorage.setItem("uploadedFilename", result.filename);
                
                // 3. Show the "Start Model" button
                const target = document.getElementById('runPy');
                target.innerHTML = '<button id="toPy">START THE MODEL</button>';
                
                // Re-bind the click event to the new button
                document.getElementById('toPy').onclick = () => runMasterAI(result.filename);
            }
        } catch (err) {
            console.error("Upload failed:", err);
        }
    }
}

async function runMasterAI(filename) {
    const btn = document.getElementById('toPy');
    btn.innerText = "AI PROCESSING... PLEASE WAIT";
    btn.disabled = true;

    try {
        console.log("Triggering Master AI Pre-compute for:", filename);
        
        // 4. Call the FastAPI Master Endpoint
        const res = await fetch(`http://127.0.0.1:8000/process-all/${filename}`);
        const result = await res.json();
        
        if (res.ok) {
            alert("AI Analysis Complete! All models pre-computed.");
            // Redirect to the dashboard now that data is ready
            window.location.href = "homepage.html";
        } else {
            alert("Error in AI processing: " + result.detail);
            btn.innerText = "START THE MODEL";
            btn.disabled = false;
        }
    } catch (err) {
        console.error("Master AI Error:", err);
        alert("Failed to connect to Python AI server.");
        btn.innerText = "START THE MODEL";
        btn.disabled = false;
    }
}

// Inside util.js
async function runMasterAI(filename) {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) overlay.style.display = 'flex'; // Show the loading screen

    try {
        const res = await fetch(`http://127.0.0.1:8000/process-all/${filename}`);
        
        if (res.ok) {
            localStorage.setItem("uploadedFilename", filename);
            window.location.href = "homepage.html"; // Redirect to auto-filled summaries
        } else {
            alert("AI Processing Error.");
            if (overlay) overlay.style.display = 'none';
        }
    } catch (err) {
        console.error(err);
        if (overlay) overlay.style.display = 'none';
    }
}