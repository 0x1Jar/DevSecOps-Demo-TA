// This file contains intentional server-side vulnerabilities for SonarQube to detect

const express = require('express');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const app = express();
const port = 3000;
const helmet = require('helmet'); // For security headers

// FIXED: Disable the X-Powered-By header to prevent information disclosure.
app.disable('x-powered-by');

// Middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// FIXED: Use Helmet to set various security headers by default.
app.use(helmet());

// Vulnerability 1: Hard-coded credentials
// FIXED: Load secrets from environment variables, not hard-coded.
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const API_SECRET = process.env.API_SECRET;

// Vulnerability 2: Insecure file operations
app.get('/download', (req, res) => {
    const fileName = req.query.file;

    // FIXED: Path traversal vulnerability. Sanitize the filename and ensure it's within the intended directory.
    const safeFileName = path.basename(fileName);
    const publicDir = path.join(__dirname, 'files');
    const filePath = path.join(publicDir, safeFileName);

    if (filePath.indexOf(publicDir) !== 0) {
        return res.status(400).send('Invalid path');
    }

    // Insecure file read
    fs.readFile(filePath, (err, data) => {
        if (err) {
            return res.status(404).send('File not found');
        }
        // Set appropriate headers for file download
        res.setHeader('Content-Disposition', `attachment; filename="${safeFileName}"`);
        res.send(data);
    });
});

// Vulnerability 3: Command injection
app.get('/ping', (req, res) => {
    const host = req.query.host;
    // Command injection vulnerability
    const cmd = 'ping -c 4 ' + host;

    // FIXED: Use spawn instead of exec to prevent command injection.
    // Arguments are passed as an array, not interpreted by a shell.
    const ping = require('child_process').spawn('ping', ['-c', '4', host]);
    let output = '';

    ping.stdout.on('data', (data) => {
        output += data.toString();
    });

    ping.stderr.on('data', (data) => {
        output += data.toString();
    });

    ping.on('close', (code) => {
        res.send(output);
    });
});

// Vulnerability 4: SQL Injection
app.get('/users', (req, res) => {
    const userId = req.query.id;
    // SQL injection vulnerability
    // FIXED: Use parameterized queries to prevent SQL injection.
    const query = 'SELECT * FROM users WHERE id = ?';

    // Simulated database query
    // The database library (e.g., 'mysql2', 'pg') would handle parameterization.
    executeQuery(query, [userId])
        .then(results => res.json(results))
        .catch(err => res.status(500).send('Database error'));
});

// Vulnerability 5: Insecure random values
app.post('/register', (req, res) => {
    const user = req.body;
    
    // FIXED: Insecure random token generation. Use crypto.randomBytes for secure tokens.
    user.token = crypto.randomBytes(16).toString('hex');
    
    // Save user (simulated)
    saveUser(user)
        .then(() => res.json({ success: true }))
        .catch(err => res.status(500).send('Registration error'));
});

// Vulnerability 6: Weak cryptography
app.post('/encrypt', (req, res) => {
    const data = req.body.data;
    
    // FIXED: Weak hashing algorithm (MD5). Use a strong algorithm like SHA256.
    const hash = crypto.createHash('sha256').update(data).digest('hex');
    
    res.json({ hash });
});

// Vulnerability 7: No input validation
app.post('/profile', (req, res) => {
    // FIXED: Add input validation.
    const { email, age } = req.body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
        return res.status(400).json({ error: 'Invalid email format.' });
    }
    if (age === undefined || typeof age !== 'number' || age < 0 || age > 120) {
        return res.status(400).json({ error: 'Invalid age.' });
    }

    // Now update the profile with validated data
    updateProfile({ email, age })
        .then(() => res.json({ success: true }))
        .catch(err => res.status(500).send('Update error'));
});

// Vulnerability 8: Insecure cookie settings
app.get('/login', (req, res) => {
    // FIXED: Insecure cookie. Add HttpOnly, Secure, and SameSite flags.
    const sessionId = crypto.randomBytes(16).toString('hex');
    res.cookie('sessionId', sessionId, {
        maxAge: 3600000, // 1 hour
        httpOnly: true,  // Prevents client-side script access
        secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
        sameSite: 'strict' // Mitigates CSRF
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
        // FIXED: Detailed error exposure. Log the full error but send a generic response.
        console.error(err); // Log the stack trace for debugging
        res.status(500).send('An internal server error occurred.');
    }
});

// Vulnerability 10: Missing security headers
app.get('/', (req, res) => {
    // FIXED: Security headers are now set by Helmet middleware.
    res.send('Welcome to the vulnerable server');
});

// Start the server
app.listen(port, () => {
    console.log(`Vulnerable server running at http://localhost:${port}`);
});

// Helper functions to avoid actual errors
function executeQuery(query, params) { return Promise.resolve([]); }
function saveUser(user) { return Promise.resolve(); }
function updateProfile(profile) { return Promise.resolve(); }
