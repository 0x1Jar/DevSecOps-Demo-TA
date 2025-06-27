// This file contains intentional vulnerabilities for SonarQube to detect

// Vulnerability 1: Hard-coded credentials
const API_KEY = "1234567890abcdef";
const PASSWORD = "admin123";
const SECRET_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";

// Vulnerability 2: SQL Injection
function getUserData(userId) {
    // This is vulnerable to SQL injection
    const query = "SELECT * FROM users WHERE id = " + userId;
    return executeQuery(query); // Imagine this executes the SQL query
}

// Vulnerability 3: Cross-site Scripting (XSS)
function displayUserInput(input) {
    // This is vulnerable to XSS
    document.getElementById("output").innerHTML = input;
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
    while (i < data.length) {
        console.log(data[i]);
        // i++ is missing
    }
}

// Vulnerability 6: Unused variables and dead code
function calculateTotal(items) {
    let total = 0;
    let tax = 0.1; // Unused variable
    
    for (let i = 0; i < items.length; i++) {
        total += items[i].price;
    }
    
    if (false) {
        // Dead code that will never execute
        console.log("This will never run");
        return 0;
    }
    
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
    // This allows accessing any file
    return readFile("/user/data/" + fileName);
}

// Vulnerability 9: Improper error handling
function processUserData(data) {
    try {
        // Some processing
        JSON.parse(data);
    } catch (e) {
        // Logging sensitive information
        console.log("Error processing data: " + e.message);
        console.log("Stack trace: " + e.stack);
        console.log("User data: " + data);
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
