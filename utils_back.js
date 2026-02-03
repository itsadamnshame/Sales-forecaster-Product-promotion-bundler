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
        // This is the line that usually causes the 500 error
        const workbook = XLSX.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        console.log("Success! Data preview:", data.slice(0, 2));
        res.json({ message: 'Excel file saved and read successfully' });
    } catch (err) {
        // If the server fails, it now sends JSON instead of a 500 HTML page
        console.error("Server Error during Excel processing:", err.message);
        res.status(500).json({ error: 'Failed to process Excel file structure.' });
    }
});

module.exports = router;