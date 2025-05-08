# This file contains explicit SQL injection vulnerabilities for SonarQube to detect

# Simulate database connection
def get_db_connection
  # This is just a simulation
  nil
end

# Vulnerability 1: Basic SQL injection in a query
def get_user_by_id(user_id)
  conn = get_db_connection
  # VULNERABLE: Direct string interpolation
  sql = "SELECT * FROM users WHERE id = #{user_id}"
  # Simulate query execution
  puts "Executing query: #{sql}"
  []
end

# Vulnerability 2: SQL injection in a WHERE clause with multiple conditions
def search_users(username, role)
  conn = get_db_connection
  # VULNERABLE: String interpolation in multiple places
  sql = "SELECT * FROM users WHERE username LIKE '%#{username}%' AND role = '#{role}'"
  # Simulate query execution
  puts "Executing query: #{sql}"
  []
end

# Vulnerability 3: SQL injection in an ORDER BY clause
def list_users(sort_column)
  conn = get_db_connection
  # VULNERABLE: Unsanitized input in ORDER BY
  sql = "SELECT * FROM users ORDER BY #{sort_column}"
  # Simulate query execution
  puts "Executing query: #{sql}"
  []
end

# Vulnerability 4: SQL injection in a LIMIT clause
def get_paginated_users(page, page_size)
  conn = get_db_connection
  offset = page * page_size
  # VULNERABLE: Direct use of parameters in LIMIT/OFFSET
  sql = "SELECT * FROM users LIMIT #{page_size} OFFSET #{offset}"
  # Simulate query execution
  puts "Executing query: #{sql}"
  []
end

# Vulnerability 5: SQL injection in an INSERT statement
def create_user(user)
  conn = get_db_connection
  # VULNERABLE: String interpolation in INSERT
  sql = "INSERT INTO users (username, email, password) 
         VALUES ('#{user[:username]}', '#{user[:email]}', '#{user[:password]}')"
  # Simulate query execution
  puts "Executing query: #{sql}"
  true
end

# Vulnerability 6: SQL injection in an UPDATE statement
def update_user_email(user_id, new_email)
  conn = get_db_connection
  # VULNERABLE: String interpolation without parameterization
  sql = "UPDATE users SET email = '#{new_email}' WHERE id = #{user_id}"
  # Simulate query execution
  puts "Executing query: #{sql}"
  true
end

# Vulnerability 7: SQL injection in a DELETE statement
def delete_user(user_id)
  conn = get_db_connection
  # VULNERABLE: Direct string interpolation in DELETE
  sql = "DELETE FROM users WHERE id = #{user_id}"
  # Simulate query execution
  puts "Executing query: #{sql}"
  true
end

# Vulnerability 8: SQL injection in a JOIN clause
def get_user_orders(user_id)
  conn = get_db_connection
  # VULNERABLE: Unsanitized parameter in JOIN query
  sql = "SELECT o.* FROM orders o JOIN users u ON o.user_id = u.id WHERE u.id = #{user_id}"
  # Simulate query execution
  puts "Executing query: #{sql}"
  []
end

# Vulnerability 9: SQL injection in a subquery
def get_users_with_orders(min_order_count)
  conn = get_db_connection
  # VULNERABLE: String interpolation in a subquery
  sql = "SELECT * FROM users WHERE id IN (SELECT user_id FROM orders GROUP BY user_id HAVING COUNT(*) > #{min_order_count})"
  # Simulate query execution
  puts "Executing query: #{sql}"
  []
end

# Vulnerability 10: SQL injection with string interpolation and conditional
def filter_users(is_active, status = nil)
  conn = get_db_connection
  # VULNERABLE: Conditional query building
  condition = is_active ? "status = 'active'" : "status = '#{status}'"
  sql = "SELECT * FROM users WHERE #{condition}"
  # Simulate query execution
  puts "Executing query: #{sql}"
  []
end

# Example usage in a Rails-like controller
class UsersController
  def show
    user_id = params[:id]
    @user = get_user_by_id(user_id)
    render json: @user
  end

  def index
    sort_column = params[:sort] || 'id'
    @users = list_users(sort_column)
    render json: @users
  end

  def create
    user = params[:user]
    success = create_user(user)
    render json: { success: success }
  end

  def update
    user_id = params[:id]
    new_email = params[:email]
    success = update_user_email(user_id, new_email)
    render json: { success: success }
  end

  def destroy
    user_id = params[:id]
    success = delete_user(user_id)
    render json: { success: success }
  end
end

# Simulate Rails params
def params
  { id: '1', sort: 'username', user: { username: 'test', email: 'test@example.com', password: 'password' } }
end
