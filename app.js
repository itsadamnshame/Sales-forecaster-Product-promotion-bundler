const express = require('express');
const session = require('express-session');
const sessionRouter = require('./session_back');
const app = express();
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

app.use(express.static('public'));
app.listen(PORT, () => {
    console.log(`Server is live at http://localhost:${PORT}`);
});