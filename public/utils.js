const upload = document.getElementById('upload');
if (upload) {
    upload.onsubmit = async (e) => {
        e.preventDefault();
        const data =  new FormData(e.target);
        const res = await fetch('http://localhost:3000/upload', {
            method: 'POST',
            body: data
        });
        const result = await res.json();
        console.log(result.message);

        if(res) {
            const runPy = '<button id="toPy">START THE MODEL</button>';
            const target = document.getElementById('runPy');
            target.innerHTML = runPy;
        }
    }
}

const startModel = document.getElementById('toPy');
if (startModel) {
    startModel.addEventListener('click', async (e) =>{
        if (e.target && e.target.id === 'toPy') {
            console.log("Starting the Python model...");
            
            try {
                const res = await fetch('http://localhost:3000/startPy', {
                    method: 'POST',
                });
                const result = await res.json();
                console.log(result.message);
                alert("Model Finished: " + result.output);
            } 
            catch (err) {
                console.error("Fetch error:", err);
            }
        }
    })
}
