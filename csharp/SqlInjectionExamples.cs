using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;

namespace VulnerableApp
{
    /// <summary>
    /// This class contains explicit SQL injection vulnerabilities for SonarQube to detect
    /// </summary>
    public class SqlInjectionExamples
    {
        // Simulate database connection
        private SqlConnection GetConnection()
        {
            // This is just a simulation
            return null;
        }

        // Vulnerability 1: Basic SQL injection in a query
        public List<User> GetUserById(string userId)
        {
            try
            {
                using (SqlConnection conn = GetConnection())
                {
                    conn.Open();
                    using (SqlCommand cmd = conn.CreateCommand())
                    {
                        // VULNERABLE: Direct string concatenation
                        cmd.CommandText = "SELECT * FROM users WHERE id = " + userId;
                        
                        // Simulate query execution
                        Console.WriteLine("Executing query: " + cmd.CommandText);
                        using (SqlDataReader reader = cmd.ExecuteReader())
                        {
                            List<User> users = new List<User>();
                            while (reader.Read())
                            {
                                // Add user to list
                            }
                            return users;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return new List<User>();
            }
        }

        // Vulnerability 2: SQL injection in a WHERE clause with multiple conditions
        public List<User> SearchUsers(string username, string role)
        {
            try
            {
                using (SqlConnection conn = GetConnection())
                {
                    conn.Open();
                    using (SqlCommand cmd = conn.CreateCommand())
                    {
                        // VULNERABLE: String concatenation in multiple places
                        cmd.CommandText = "SELECT * FROM users WHERE username LIKE '%" + username + "%' AND role = '" + role + "'";
                        
                        // Simulate query execution
                        Console.WriteLine("Executing query: " + cmd.CommandText);
                        using (SqlDataReader reader = cmd.ExecuteReader())
                        {
                            List<User> users = new List<User>();
                            while (reader.Read())
                            {
                                // Add user to list
                            }
                            return users;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return new List<User>();
            }
        }

        // Vulnerability 3: SQL injection in an ORDER BY clause
        public List<User> ListUsers(string sortColumn)
        {
            try
            {
                using (SqlConnection conn = GetConnection())
                {
                    conn.Open();
                    using (SqlCommand cmd = conn.CreateCommand())
                    {
                        // VULNERABLE: Unsanitized input in ORDER BY
                        cmd.CommandText = "SELECT * FROM users ORDER BY " + sortColumn;
                        
                        // Simulate query execution
                        Console.WriteLine("Executing query: " + cmd.CommandText);
                        using (SqlDataReader reader = cmd.ExecuteReader())
                        {
                            List<User> users = new List<User>();
                            while (reader.Read())
                            {
                                // Add user to list
                            }
                            return users;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return new List<User>();
            }
        }

        // Vulnerability 4: SQL injection in a LIMIT/OFFSET clause (SQL Server equivalent)
        public List<User> GetPaginatedUsers(int page, int pageSize)
        {
            try
            {
                using (SqlConnection conn = GetConnection())
                {
                    conn.Open();
                    using (SqlCommand cmd = conn.CreateCommand())
                    {
                        int offset = page * pageSize;
                        // VULNERABLE: Direct use of parameters in OFFSET/FETCH
                        cmd.CommandText = "SELECT * FROM users ORDER BY id OFFSET " + offset + " ROWS FETCH NEXT " + pageSize + " ROWS ONLY";
                        
                        // Simulate query execution
                        Console.WriteLine("Executing query: " + cmd.CommandText);
                        using (SqlDataReader reader = cmd.ExecuteReader())
                        {
                            List<User> users = new List<User>();
                            while (reader.Read())
                            {
                                // Add user to list
                            }
                            return users;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return new List<User>();
            }
        }

        // Vulnerability 5: SQL injection in an INSERT statement
        public bool CreateUser(User user)
        {
            try
            {
                using (SqlConnection conn = GetConnection())
                {
                    conn.Open();
                    using (SqlCommand cmd = conn.CreateCommand())
                    {
                        // VULNERABLE: String concatenation in INSERT
                        cmd.CommandText = "INSERT INTO users (username, email, password) VALUES ('" + 
                                         user.Username + "', '" + 
                                         user.Email + "', '" + 
                                         user.Password + "')";
                        
                        // Simulate query execution
                        Console.WriteLine("Executing query: " + cmd.CommandText);
                        cmd.ExecuteNonQuery();
                        
                        return true;
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return false;
            }
        }

        // Vulnerability 6: SQL injection in an UPDATE statement
        public bool UpdateUserEmail(string userId, string newEmail)
        {
            try
            {
                using (SqlConnection conn = GetConnection())
                {
                    conn.Open();
                    using (SqlCommand cmd = conn.CreateCommand())
                    {
                        // VULNERABLE: String concatenation without parameterization
                        cmd.CommandText = "UPDATE users SET email = '" + newEmail + "' WHERE id = " + userId;
                        
                        // Simulate query execution
                        Console.WriteLine("Executing query: " + cmd.CommandText);
                        cmd.ExecuteNonQuery();
                        
                        return true;
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return false;
            }
        }

        // Helper class
        public class User
        {
            public string Id { get; set; }
            public string Username { get; set; }
            public string Email { get; set; }
            public string Password { get; set; }
        }
    }
}
