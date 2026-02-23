const express = require('express');
const router = express.Router();
const path = require('path');

const protect = (req, res, next) => {
    if (req.session.userId) {
        next();
    } 
    else {
        // Redirect to login if not authorized
        res.redirect('/login.html'); 
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

// Paths updated to point to the /html folder
router.get('/homepage.html', protect, (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'homepage.html')); 
});

router.get('/upload.html', protect, (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'upload.html')); 
});

router.get('/forecaster.html', protect, (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'forecaster.html')); 
});

router.get('/marketer.html', protect, (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'marketer.html')); 
});

router.get('/influence.html', protect, (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'influence.html')); 
});

router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).json({ error: "Could not log out" });
        res.clearCookie('connect.sid');
        res.json({ message: "Logged out" });
    });
});

module.exports = router;