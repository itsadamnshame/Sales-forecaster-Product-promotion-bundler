upload = document.getElementById('upload');

upload.onsubmit = async (e) => {
    e.preventDefault();
    const data =  new FormData(e.target);
    const response = await fetch('http://localhost:3000/upload', {
        method: 'POST',
        body: data
    });
    const result = await response.json();
    console.log(result.message);
}