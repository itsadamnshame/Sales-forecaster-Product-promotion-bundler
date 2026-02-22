const express = require('express');
const router = express.Router();

const protect = (req, res, next) => {
    if (req.session.userId) {
        next();
    } 
    else {
        next(); // TEMPORARY
    }
};

router.post('/login', (req, res) => {
    const { uname, pass } = req.body;
    if (uname === 'user' && pass === '1234') {
        req.session.userId = 1;
        res.json({ message: "Login Successful" });
    } 
    else {
        res.status(401).json({ error: "Invalid credentials" });
    }
});

router.get('/homepage.html', protect, (req, res) => {
    res.sendFile(process.cwd() + '/html/homepage.html'); 
});

router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: "Could not log out" });
        }
        res.clearCookie('connect.sid');
        res.json({ message: "Logged out" });
    });
})

router.get('/upload.html', protect, (req, res) => {
    res.sendFile(process.cwd() + '/upload.html'); 
});

router.get('/forecaster.html', protect, (req, res) => {
    res.sendFile(process.cwd() + '/html/forecaster.html'); 
});

router.get('/marketer.html', protect, (req, res) => {
    res.sendFile(process.cwd() + '/html/marketer.html'); 
});

router.get('/influence.html', protect, (req, res) => {
    res.sendFile(process.cwd() + '/html/influence.html'); 
});

module.exports = router;