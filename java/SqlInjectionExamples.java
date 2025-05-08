package com.example.vulnerable;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * This class contains explicit SQL injection vulnerabilities for SonarQube to detect
 */
public class SqlInjectionExamples {

    // Simulate database connection
    private Connection getConnection() throws SQLException {
        // This is just a simulation
        return null;
    }

    // Vulnerability 1: Basic SQL injection in a query
    public List<User> getUserById(String userId) {
        try {
            Connection conn = getConnection();
            Statement stmt = conn.createStatement();
            
            // VULNERABLE: Direct string concatenation
            String sql = "SELECT * FROM users WHERE id = " + userId;
            
            // Simulate query execution
            System.out.println("Executing query: " + sql);
            ResultSet rs = stmt.executeQuery(sql);
            
            // Process results
            List<User> users = new ArrayList<>();
            while (rs.next()) {
                // Add user to list
            }
            return users;
        } catch (SQLException e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    // Vulnerability 2: SQL injection in a WHERE clause with multiple conditions
    public List<User> searchUsers(String username, String role) {
        try {
            Connection conn = getConnection();
            Statement stmt = conn.createStatement();
            
            // VULNERABLE: String concatenation in multiple places
            String sql = "SELECT * FROM users WHERE username LIKE '%" + username + "%' AND role = '" + role + "'";
            
            // Simulate query execution
            System.out.println("Executing query: " + sql);
            ResultSet rs = stmt.executeQuery(sql);
            
            // Process results
            List<User> users = new ArrayList<>();
            while (rs.next()) {
                // Add user to list
            }
            return users;
        } catch (SQLException e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    // Vulnerability 3: SQL injection in an ORDER BY clause
    public List<User> listUsers(String sortColumn) {
        try {
            Connection conn = getConnection();
            Statement stmt = conn.createStatement();
            
            // VULNERABLE: Unsanitized input in ORDER BY
            String sql = "SELECT * FROM users ORDER BY " + sortColumn;
            
            // Simulate query execution
            System.out.println("Executing query: " + sql);
            ResultSet rs = stmt.executeQuery(sql);
            
            // Process results
            List<User> users = new ArrayList<>();
            while (rs.next()) {
                // Add user to list
            }
            return users;
        } catch (SQLException e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    // Vulnerability 4: SQL injection in a LIMIT clause
    public List<User> getPaginatedUsers(int page, int pageSize) {
        try {
            Connection conn = getConnection();
            Statement stmt = conn.createStatement();
            
            int offset = page * pageSize;
            // VULNERABLE: Direct use of parameters in LIMIT/OFFSET
            String sql = "SELECT * FROM users LIMIT " + pageSize + " OFFSET " + offset;
            
            // Simulate query execution
            System.out.println("Executing query: " + sql);
            ResultSet rs = stmt.executeQuery(sql);
            
            // Process results
            List<User> users = new ArrayList<>();
            while (rs.next()) {
                // Add user to list
            }
            return users;
        } catch (SQLException e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    // Vulnerability 5: SQL injection in an INSERT statement
    public boolean createUser(Map<String, String> user) {
        try {
            Connection conn = getConnection();
            Statement stmt = conn.createStatement();
            
            // VULNERABLE: String concatenation in INSERT
            String sql = "INSERT INTO users (username, email, password) VALUES ('" + 
                         user.get("username") + "', '" + 
                         user.get("email") + "', '" + 
                         user.get("password") + "')";
            
            // Simulate query execution
            System.out.println("Executing query: " + sql);
            stmt.executeUpdate(sql);
            
            return true;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    // Vulnerability 6: SQL injection in an UPDATE statement
    public boolean updateUserEmail(String userId, String newEmail) {
        try {
            Connection conn = getConnection();
            Statement stmt = conn.createStatement();
            
            // VULNERABLE: String concatenation without parameterization
            String sql = "UPDATE users SET email = '" + newEmail + "' WHERE id = " + userId;
            
            // Simulate query execution
            System.out.println("Executing query: " + sql);
            stmt.executeUpdate(sql);
            
            return true;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    // Vulnerability 7: SQL injection in a DELETE statement
    public boolean deleteUser(String userId) {
        try {
            Connection conn = getConnection();
            Statement stmt = conn.createStatement();
            
            // VULNERABLE: Direct concatenation in DELETE
            String sql = "DELETE FROM users WHERE id = " + userId;
            
            // Simulate query execution
            System.out.println("Executing query: " + sql);
            stmt.executeUpdate(sql);
            
            return true;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    // Helper class
    class User {
        private String id;
        private String username;
        private String email;
        
        // Getters and setters
    }
}
