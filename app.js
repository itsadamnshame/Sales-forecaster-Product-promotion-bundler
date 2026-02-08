const express = require('express');
const session = require('express-session');
const sessionRouter = require('./session_back');
const utilRouter = require('./utils_back');
const app = express();
const fs = require('fs');
const path = require('path');
PORT = 3000;

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
app.use('/', sessionRouter);

folders = ['uploads', 'forecast_files'];

for(i=0; i<folders.length; i++){
    const uploadDir = path.join(__dirname, folders[i]);

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
        console.log('Successfully created the /' + folders[i] + ' folder.');
    }
}

app.use('/', utilRouter);

app.use(express.static('public'));
app.use('/style', express.static('style'));
app.listen(PORT, () => {
    console.log(`Server is live at http://localhost:${PORT}`);
});