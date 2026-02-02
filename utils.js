upload = document.getElementById('upload');

const dataset = (fileName, dataFile) => {
    console.log(fileName, dataFile)
}

upload.onsubmit = (e) => {
    e.preventDefault();
    const data =  new FormData(e.target);
    let fileName = data.get('filename');
    let dataFile = data.get('datafile');
    dataset(fileName, dataFile);
}