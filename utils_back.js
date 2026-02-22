const express = require('express');
const router = express.Router();
const multer = require('multer');
const XLSX = require('xlsx');

const storage = multer.diskStorage({ 
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + file.originalname;
        cb(null, uniqueName);
    }
 });

const uploadProcessor = multer({ storage: storage });

router.post('/upload', uploadProcessor.single('datafile'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file was uploaded.' });
    }
    try {
        const workbook = XLSX.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        console.log("Success! Data preview:", data.slice(0, 2));
        res.json({ message: 'Excel file saved and read successfully' });
    } catch (err) {
        console.error("Server Error during Excel processing:", err.message);
        res.status(500).json({ error: 'Failed to process Excel file structure.' });
    }
});

router.post('/startPy', (req, res) => {
    const { exec } = require('child_process');

    exec('python python/main.py', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return res.status(500).json({ error: error.message });
        }
        if (stderr) {
            console.error(`Script Error: ${stderr}`);
            return res.status(500).json({ error: stderr });
        }

        console.log(`Model Output: ${stdout}`);
        res.json({ message: 'Python script finished', output: stdout });
    });
});


module.exports = router;