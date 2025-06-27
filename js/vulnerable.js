// This file contains intentional vulnerabilities for SonarQube to detect
// This is the SECURE version of the file.

// Vulnerability 1: Hard-coded credentials
// FIXED: Never store secrets in client-side JavaScript.
// These should be handled by a secure backend and passed via secure, HttpOnly cookies or other server-driven mechanisms.

// Vulnerability 2: SQL Injection
function getUserData(userId) {
    // FIXED: SQL Injection is a server-side vulnerability.
    // Client-side code should call a secure API endpoint.
    // Example: return fetch(`/api/users/${encodeURIComponent(userId)}`);
    console.log(`Fetching data for user: ${userId}`);
}

// Vulnerability 3: Cross-site Scripting (XSS)
function displayUserInput(input) {
    // FIXED: This is vulnerable to XSS. Use textContent to safely render user input as text.
    const outputElement = document.getElementById("output");
    if (outputElement) {
        outputElement.textContent = input;
    }
}

// Vulnerability 4: Insecure random values
function generateRandomToken() {
    // FIXED: Using Math.random() for security purposes is insecure. Use window.crypto.
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return "token_" + array[0].toString(36);
}

// Vulnerability 5: Potential infinite loop
function processData(data) {
    let i = 0;
    // Missing increment can cause infinite loop
    // FIXED: Added incrementor to prevent infinite loop.
    while (i < data.length) { 
        console.log(data[i]);
        i++;
    }
}

// Vulnerability 6: Unused variables and dead code
function calculateTotal(items) {
    let total = 0;
    // FIXED: Removed unused variable 'tax'.
    
    for (let i = 0; i < items.length; i++) {
        total += items[i].price;
    }
    // FIXED: Removed dead code block.
    return total;
}

// Vulnerability 7: Insecure object creation
function createUserObject(userData) {
    // FIXED: Using eval is insecure. Use JSON.parse() instead.
    try {
        return JSON.parse(userData);
    } catch (e) {
        console.error("Invalid JSON data:", e);
        return null;
    }
}

// Vulnerability 8: Insecure direct object reference
function getUserFile(fileName) {
    // FIXED: Path Traversal is a server-side vulnerability.
    // The client should request a file, and the server must validate the request.
    // Example: return fetch(`/api/files?file=${encodeURIComponent(fileName)}`);
    console.log(`Requesting file: ${fileName}`);
}

// Vulnerability 9: Improper error handling
function processUserData(data) {
    try {
        // Some processing
        return JSON.parse(data);
    } catch (e) {
        // FIXED: Do not log potentially sensitive user data in error messages.
        console.error("Error processing data: " + e.message);
        // The stack trace is fine for debugging, but avoid logging the raw 'data'.
    }
}

// Vulnerability 10: Insecure timeout
function delayedProcessing(userData) {
    // FIXED: Using setTimeout with a string argument is insecure. Use a function callback.
    setTimeout(function() {
        processUserData(userData);
    }, 1000);
}

// Helper functions to avoid actual errors
function executeQuery(query) { return []; }
function readFile(path) { return ""; }
