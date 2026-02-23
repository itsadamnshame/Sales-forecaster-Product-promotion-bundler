const express = require('express');
const session = require('express-session');
const sessionRouter = require('./session_back');
const utilRouter = require('./utils_back');
const app = express();
const fs = require('fs');
const path = require('path');
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(
    session({
        secret: 'idk', // Recommendation: Change to a complex string for production
        saveUninitialized: false,
        resave: false,
        cookie: {
            maxAge: 60000 * 60 // 1 hour session
        }
}));

// Folder creation logic for Hybrid Model outputs
const folders = [
    'uploads', 
    'python/exports/temp', 
    'python/exports/saved'
];

folders.forEach(folder => {
    const dir = path.join(__dirname, folder);
    if (!fs.existsSync(dir)) {
        // recursive: true creates parent folders automatically
        fs.mkdirSync(dir, { recursive: true });
        console.log(`Successfully created the /${folder} folder.`);
    }
});

// ROUTING
app.use('/', sessionRouter);
app.use('/', utilRouter);

// STATIC FILE SERVING
app.use(express.static('public')); // Login & session assets
app.use('/js', express.static(path.join(__dirname, 'html', 'js'))); 
app.use('/style', express.static(path.join(__dirname, 'html', 'style')));

// Access to the export folder for the Forecaster Iframe
app.use('/export', express.static(path.join(__dirname, 'html', 'export')));

app.use('/exports', express.static(path.join(__dirname, 'python', 'exports')));

// Root HTML access
app.use(express.static(path.join(__dirname, 'python')));

app.listen(PORT, () => {
    console.log(`Server is live at http://localhost:${PORT}`);
});