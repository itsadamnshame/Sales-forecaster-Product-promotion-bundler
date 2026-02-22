const express = require('express');
const session = require('express-session');
const sessionRouter = require('./session_back');
const utilRouter = require('./utils_back');
const app = express();
const fs = require('fs');
const path = require('path');
const PORT = 3000;

app.use(express.json());
app.use(
    session({
        secret: 'idk',
        saveUninitialized: false,
        resave: false,
        cookie: {
            maxAge: 60000 * 60
        }
}));

// Folder creation logic
const folders = ['uploads'];
folders.forEach(folder => {
    const dir = path.join(__dirname, folder);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
        console.log(`Successfully created the /${folder} folder.`);
    }
});

// ROUTING
app.use('/', sessionRouter);
app.use('/', utilRouter);

// Add these to your app.js
app.use(express.static('public')); // For login.html and session.js
app.use('/js', express.static(path.join(__dirname, 'html', 'js'))); 
app.use('/style', express.static(path.join(__dirname, 'html', 'style')));

app.listen(PORT, () => {
    console.log(`Server is live at http://localhost:${PORT}`);
});