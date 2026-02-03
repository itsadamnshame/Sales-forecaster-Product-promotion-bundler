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
    }
}