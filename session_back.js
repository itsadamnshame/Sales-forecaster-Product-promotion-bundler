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
    res.sendFile(process.cwd() + '/homepage.html'); 
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
    res.sendFile(process.cwd() + '/forecaster.html'); 
});

router.get('/market_analyze.html', protect, (req, res) => {
    res.sendFile(process.cwd() + '/market_analyze.html'); 
});

module.exports = router;