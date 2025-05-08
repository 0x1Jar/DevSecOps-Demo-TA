#!/usr/bin/env python3
"""
This file contains explicit SQL injection vulnerabilities for SonarQube to detect
"""

import sqlite3
from flask import Flask, request, jsonify

app = Flask(__name__)

# Simulate database connection
def get_db_connection():
    # This is just a simulation
    return None

# Vulnerability 1: Basic SQL injection in a query
def get_user_by_id(user_id):
    conn = get_db_connection()
    # VULNERABLE: Direct string formatting
    sql = f"SELECT * FROM users WHERE id = {user_id}"
    # Simulate query execution
    print(f"Executing query: {sql}")
    return []

# Vulnerability 2: SQL injection in a WHERE clause with multiple conditions
def search_users(username, role):
    conn = get_db_connection()
    # VULNERABLE: String formatting in multiple places
    sql = f"SELECT * FROM users WHERE username LIKE '%{username}%' AND role = '{role}'"
    # Simulate query execution
    print(f"Executing query: {sql}")
    return []

# Vulnerability 3: SQL injection in an ORDER BY clause
def list_users(sort_column):
    conn = get_db_connection()
    # VULNERABLE: Unsanitized input in ORDER BY
    sql = f"SELECT * FROM users ORDER BY {sort_column}"
    # Simulate query execution
    print(f"Executing query: {sql}")
    return []

# Vulnerability 4: SQL injection in a LIMIT clause
def get_paginated_users(page, page_size):
    conn = get_db_connection()
    offset = page * page_size
    # VULNERABLE: Direct use of parameters in LIMIT/OFFSET
    sql = f"SELECT * FROM users LIMIT {page_size} OFFSET {offset}"
    # Simulate query execution
    print(f"Executing query: {sql}")
    return []

# Vulnerability 5: SQL injection in an INSERT statement
def create_user(user):
    conn = get_db_connection()
    # VULNERABLE: String formatting in INSERT
    sql = f"INSERT INTO users (username, email, password) VALUES ('{user['username']}', '{user['email']}', '{user['password']}')"
    # Simulate query execution
    print(f"Executing query: {sql}")
    return True

# Vulnerability 6: SQL injection in an UPDATE statement
def update_user_email(user_id, new_email):
    conn = get_db_connection()
    # VULNERABLE: String formatting without parameterization
    sql = f"UPDATE users SET email = '{new_email}' WHERE id = {user_id}"
    # Simulate query execution
    print(f"Executing query: {sql}")
    return True

# Vulnerability 7: SQL injection in a DELETE statement
def delete_user(user_id):
    conn = get_db_connection()
    # VULNERABLE: Direct string formatting in DELETE
    sql = f"DELETE FROM users WHERE id = {user_id}"
    # Simulate query execution
    print(f"Executing query: {sql}")
    return True

# Vulnerability 8: SQL injection in a JOIN clause
def get_user_orders(user_id):
    conn = get_db_connection()
    # VULNERABLE: Unsanitized parameter in JOIN query
    sql = f"SELECT o.* FROM orders o JOIN users u ON o.user_id = u.id WHERE u.id = {user_id}"
    # Simulate query execution
    print(f"Executing query: {sql}")
    return []

# Vulnerability 9: SQL injection in a subquery
def get_users_with_orders(min_order_count):
    conn = get_db_connection()
    # VULNERABLE: String formatting in a subquery
    sql = f"SELECT * FROM users WHERE id IN (SELECT user_id FROM orders GROUP BY user_id HAVING COUNT(*) > {min_order_count})"
    # Simulate query execution
    print(f"Executing query: {sql}")
    return []

# Vulnerability 10: SQL injection with string formatting and conditional
def filter_users(is_active, status=None):
    conn = get_db_connection()
    # VULNERABLE: Conditional query building
    condition = "status = 'active'" if is_active else f"status = '{status}'"
    sql = f"SELECT * FROM users WHERE {condition}"
    # Simulate query execution
    print(f"Executing query: {sql}")
    return []

# Flask routes to demonstrate vulnerabilities
@app.route('/users/<user_id>')
def api_get_user(user_id):
    # VULNERABLE: Directly passing user input to function
    users = get_user_by_id(user_id)
    return jsonify(users)

@app.route('/users/search')
def api_search_users():
    # VULNERABLE: Directly passing request parameters
    username = request.args.get('username', '')
    role = request.args.get('role', '')
    users = search_users(username, role)
    return jsonify(users)

@app.route('/users')
def api_list_users():
    # VULNERABLE: Directly passing request parameters
    sort_column = request.args.get('sort', 'id')
    users = list_users(sort_column)
    return jsonify(users)

@app.route('/users/create', methods=['POST'])
def api_create_user():
    # VULNERABLE: Directly passing request JSON
    user = request.json
    success = create_user(user)
    return jsonify({"success": success})

if __name__ == '__main__':
    app.run(debug=True)
