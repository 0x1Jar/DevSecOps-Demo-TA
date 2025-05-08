/**
 * This file contains explicit SQL injection vulnerabilities for SonarQube to detect
 */

// Database connection simulation
const db = {
  query: function(sql, params) {
    console.log(`Executing query: ${sql}`);
    // This is just a simulation
    return Promise.resolve([]);
  }
};

// Vulnerability 1: Basic SQL injection in a query
function getUserById(userId) {
  // VULNERABLE: Direct string concatenation
  const sql = "SELECT * FROM users WHERE id = " + userId;
  return db.query(sql);
}

// Vulnerability 2: SQL injection in a WHERE clause with multiple conditions
function searchUsers(username, role) {
  // VULNERABLE: String concatenation in multiple places
  const sql = "SELECT * FROM users WHERE username LIKE '%" + username + "%' AND role = '" + role + "'";
  return db.query(sql);
}

// Vulnerability 3: SQL injection in an ORDER BY clause
function listUsers(sortColumn) {
  // VULNERABLE: Unsanitized input in ORDER BY
  const sql = "SELECT * FROM users ORDER BY " + sortColumn;
  return db.query(sql);
}

// Vulnerability 4: SQL injection in a LIMIT clause
function getPaginatedUsers(page, pageSize) {
  const offset = page * pageSize;
  // VULNERABLE: Direct use of parameters in LIMIT/OFFSET
  const sql = "SELECT * FROM users LIMIT " + pageSize + " OFFSET " + offset;
  return db.query(sql);
}

// Vulnerability 5: SQL injection in an INSERT statement
function createUser(user) {
  // VULNERABLE: String interpolation in INSERT
  const sql = `INSERT INTO users (username, email, password) 
               VALUES ('${user.username}', '${user.email}', '${user.password}')`;
  return db.query(sql);
}

// Vulnerability 6: SQL injection in an UPDATE statement
function updateUserEmail(userId, newEmail) {
  // VULNERABLE: Template literals without parameterization
  const sql = `UPDATE users SET email = '${newEmail}' WHERE id = ${userId}`;
  return db.query(sql);
}

// Vulnerability 7: SQL injection in a DELETE statement
function deleteUser(userId) {
  // VULNERABLE: Direct concatenation in DELETE
  const sql = "DELETE FROM users WHERE id = " + userId;
  return db.query(sql);
}

// Vulnerability 8: SQL injection in a JOIN clause
function getUserOrders(userId) {
  // VULNERABLE: Unsanitized parameter in JOIN query
  const sql = "SELECT o.* FROM orders o JOIN users u ON o.user_id = u.id WHERE u.id = " + userId;
  return db.query(sql);
}

// Vulnerability 9: SQL injection in a subquery
function getUsersWithOrders() {
  // VULNERABLE: String concatenation in a subquery
  const minOrderCount = getUserInput(); // Assume this returns user input
  const sql = "SELECT * FROM users WHERE id IN (SELECT user_id FROM orders GROUP BY user_id HAVING COUNT(*) > " + minOrderCount + ")";
  return db.query(sql);
}

// Vulnerability 10: SQL injection with string concatenation and ternary operator
function filterUsers(isActive) {
  // VULNERABLE: Conditional query building
  const sql = "SELECT * FROM users WHERE " + (isActive ? "status = 'active'" : "status = '" + getUserInput() + "'");
  return db.query(sql);
}

// Helper function to simulate user input
function getUserInput() {
  return "user_input";
}

// Export functions for use in other modules
module.exports = {
  getUserById,
  searchUsers,
  listUsers,
  getPaginatedUsers,
  createUser,
  updateUserEmail,
  deleteUser,
  getUserOrders,
  getUsersWithOrders,
  filterUsers
};
