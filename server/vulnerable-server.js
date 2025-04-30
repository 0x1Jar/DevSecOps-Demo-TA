// This file contains intentional server-side vulnerabilities for SonarQube to detect

const express = require('express');
const fs = require('fs');
const crypto = require('crypto');
const app = express();
const port = 3000;

// Middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Vulnerability 1: Hard-coded credentials
const DB_USER = "admin";
const DB_PASSWORD = "password123";
const API_SECRET = "my-super-secret-api-key";

// Vulnerability 2: Insecure file operations
app.get('/download', (req, res) => {
    const fileName = req.query.file;
    // Path traversal vulnerability
    const filePath = __dirname + '/files/' + fileName;
    
    // Insecure file read
    fs.readFile(filePath, (err, data) => {
        if (err) {
            return res.status(404).send('File not found');
        }
        res.send(data);
    });
});

// Vulnerability 3: Command injection
app.get('/ping', (req, res) => {
    const host = req.query.host;
    // Command injection vulnerability
    const cmd = 'ping -c 4 ' + host;
    
    require('child_process').exec(cmd, (err, stdout, stderr) => {
        res.send(stdout);
    });
});

// Vulnerability 4: SQL Injection
app.get('/users', (req, res) => {
    const userId = req.query.id;
    // SQL injection vulnerability
    const query = `SELECT * FROM users WHERE id = ${userId}`;
    
    // Simulated database query
    executeQuery(query)
        .then(results => res.json(results))
        .catch(err => res.status(500).send('Database error'));
});

// Vulnerability 5: Insecure random values
app.post('/register', (req, res) => {
    const user = req.body;
    
    // Insecure random token generation
    user.token = Math.random().toString(36).substring(2);
    
    // Save user (simulated)
    saveUser(user)
        .then(() => res.json({ success: true }))
        .catch(err => res.status(500).send('Registration error'));
});

// Vulnerability 6: Weak cryptography
app.post('/encrypt', (req, res) => {
    const data = req.body.data;
    
    // Weak encryption algorithm (MD5)
    const hash = crypto.createHash('md5').update(data).digest('hex');
    
    res.json({ hash });
});

// Vulnerability 7: No input validation
app.post('/profile', (req, res) => {
    const profile = req.body;
    
    // No validation of input
    updateProfile(profile)
        .then(() => res.json({ success: true }))
        .catch(err => res.status(500).send('Update error'));
});

// Vulnerability 8: Insecure cookie settings
app.get('/login', (req, res) => {
    // Insecure cookie (missing HttpOnly, Secure flags)
    res.cookie('sessionId', 'abc123', { 
        maxAge: 3600000
    });
    
    res.send('Logged in');
});

// Vulnerability 9: Information exposure in error messages
app.get('/error', (req, res) => {
    try {
        // Intentional error
        const obj = null;
        obj.property = 'value';
    } catch (err) {
        // Detailed error exposure
        res.status(500).json({
            error: err.message,
            stack: err.stack,
            details: 'Error occurred in server module'
        });
    }
});

// Vulnerability 10: Missing security headers
app.get('/', (req, res) => {
    // No security headers set
    res.send('Welcome to the vulnerable server');
});

// Start the server
app.listen(port, () => {
    console.log(`Vulnerable server running at http://localhost:${port}`);
});

// Helper functions to avoid actual errors
function executeQuery(query) { return Promise.resolve([]); }
function saveUser(user) { return Promise.resolve(); }
function updateProfile(profile) { return Promise.resolve(); }
