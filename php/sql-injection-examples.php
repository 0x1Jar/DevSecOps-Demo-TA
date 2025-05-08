<?php
/**
 * This file contains explicit SQL injection vulnerabilities for SonarQube to detect
 */

// Simulate database connection
function getDbConnection() {
    // This is just a simulation
    return new stdClass();
}

// Vulnerability 1: Basic SQL injection in a query
function getUserById($userId) {
    $conn = getDbConnection();
    // VULNERABLE: Direct string concatenation
    $sql = "SELECT * FROM users WHERE id = " . $userId;
    // Simulate query execution
    echo "Executing query: $sql\n";
    return [];
}

// Vulnerability 2: SQL injection in a WHERE clause with multiple conditions
function searchUsers($username, $role) {
    $conn = getDbConnection();
    // VULNERABLE: String concatenation in multiple places
    $sql = "SELECT * FROM users WHERE username LIKE '%" . $username . "%' AND role = '" . $role . "'";
    // Simulate query execution
    echo "Executing query: $sql\n";
    return [];
}

// Vulnerability 3: SQL injection in an ORDER BY clause
function listUsers($sortColumn) {
    $conn = getDbConnection();
    // VULNERABLE: Unsanitized input in ORDER BY
    $sql = "SELECT * FROM users ORDER BY " . $sortColumn;
    // Simulate query execution
    echo "Executing query: $sql\n";
    return [];
}

// Vulnerability 4: SQL injection in a LIMIT clause
function getPaginatedUsers($page, $pageSize) {
    $conn = getDbConnection();
    $offset = $page * $pageSize;
    // VULNERABLE: Direct use of parameters in LIMIT/OFFSET
    $sql = "SELECT * FROM users LIMIT " . $pageSize . " OFFSET " . $offset;
    // Simulate query execution
    echo "Executing query: $sql\n";
    return [];
}

// Vulnerability 5: SQL injection in an INSERT statement
function createUser($user) {
    $conn = getDbConnection();
    // VULNERABLE: String interpolation in INSERT
    $sql = "INSERT INTO users (username, email, password) 
            VALUES ('{$user['username']}', '{$user['email']}', '{$user['password']}')";
    // Simulate query execution
    echo "Executing query: $sql\n";
    return true;
}

// Vulnerability 6: SQL injection in an UPDATE statement
function updateUserEmail($userId, $newEmail) {
    $conn = getDbConnection();
    // VULNERABLE: String interpolation without parameterization
    $sql = "UPDATE users SET email = '$newEmail' WHERE id = $userId";
    // Simulate query execution
    echo "Executing query: $sql\n";
    return true;
}

// Vulnerability 7: SQL injection in a DELETE statement
function deleteUser($userId) {
    $conn = getDbConnection();
    // VULNERABLE: Direct concatenation in DELETE
    $sql = "DELETE FROM users WHERE id = " . $userId;
    // Simulate query execution
    echo "Executing query: $sql\n";
    return true;
}

// Vulnerability 8: SQL injection in a JOIN clause
function getUserOrders($userId) {
    $conn = getDbConnection();
    // VULNERABLE: Unsanitized parameter in JOIN query
    $sql = "SELECT o.* FROM orders o JOIN users u ON o.user_id = u.id WHERE u.id = " . $userId;
    // Simulate query execution
    echo "Executing query: $sql\n";
    return [];
}

// Vulnerability 9: SQL injection in a subquery
function getUsersWithOrders() {
    $conn = getDbConnection();
    // VULNERABLE: String concatenation in a subquery
    $minOrderCount = $_GET['min_orders']; // Direct use of GET parameter
    $sql = "SELECT * FROM users WHERE id IN (SELECT user_id FROM orders GROUP BY user_id HAVING COUNT(*) > " . $minOrderCount . ")";
    // Simulate query execution
    echo "Executing query: $sql\n";
    return [];
}

// Vulnerability 10: SQL injection with string concatenation and conditional
function filterUsers($isActive) {
    $conn = getDbConnection();
    // VULNERABLE: Conditional query building
    $status = $_POST['status']; // Direct use of POST parameter
    $sql = "SELECT * FROM users WHERE " . ($isActive ? "status = 'active'" : "status = '" . $status . "'");
    // Simulate query execution
    echo "Executing query: $sql\n";
    return [];
}

// Example usage
if (isset($_GET['id'])) {
    $users = getUserById($_GET['id']);
}

if (isset($_GET['username']) && isset($_GET['role'])) {
    $users = searchUsers($_GET['username'], $_GET['role']);
}

if (isset($_GET['sort'])) {
    $users = listUsers($_GET['sort']);
}
?>
