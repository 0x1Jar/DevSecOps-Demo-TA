# #!/usr/bin/env python3
# """
# This file contains explicit SQL injection vulnerabilities for SonarQube to detect
# """

# import os
# import sqlite3
# from flask import Flask, request, jsonify, render_template_string
# from flask_wtf import FlaskForm
# from wtforms import StringField, SubmitField
# from wtforms.validators import DataRequired

# app = Flask(__name__)
# # FIXED: Add a secret key for CSRF protection from an environment variable.
# # The application will fail to start if the secret key is not provided,
# # preventing the use of a default, insecure key.
# SECRET_KEY = os.environ.get('FLASK_SECRET_KEY')
# if not SECRET_KEY:
#     raise ValueError("No FLASK_SECRET_KEY set for Flask application. Please set this environment variable.")
# app.config['SECRET_KEY'] = SECRET_KEY


# # Simulate database connection
# def get_db_connection():
#     # This is just a simulation
#     return None


# # Vulnerability 2: SQL injection in a WHERE clause with multiple conditions
# def search_users(username, role):
#     conn = get_db_connection()
#     # FIXED: Use parameterized query for both conditions
#     sql = "SELECT * FROM users WHERE username LIKE ? AND role = ?"
#     # Simulate query execution
#     print(f"Executing query: {sql} with params: ('%{username}%', '{role}')")
#     return execute_query(sql, (f"%{username}%", role))

# # Vulnerability 3: SQL injection in an ORDER BY clause
# def list_users(sort_column):
#     conn = get_db_connection()
#     # FIXED: Validate sort_column against a whitelist of allowed columns
#     allowed_columns = ["id", "username", "email", "role"]
#     if sort_column not in allowed_columns:
#         raise ValueError("Invalid sort column")
#     sql = f"SELECT * FROM users ORDER BY {sort_column}" # Safe now after validation
#     # Simulate query execution
#     print(f"Executing query: {sql}")
#     return execute_query(sql)

# # Vulnerability 4: SQL injection in a LIMIT clause
# def get_paginated_users(page, page_size):
#     conn = get_db_connection()
#     # FIXED: Ensure page and page_size are integers
#     try:
#         page_int = int(page)
#         page_size_int = int(page_size)
#         offset = page_int * page_size_int
#     except (ValueError, TypeError):
#         raise ValueError("Page and page_size must be integers.")
#     sql = "SELECT * FROM users LIMIT ? OFFSET ?"
#     # Simulate query execution
#     print(f"Executing query: {sql} with params: ({page_size_int}, {offset})")
#     return execute_query(sql, (page_size_int, offset))

# # Vulnerability 5: SQL injection in an INSERT statement
# def create_user(user):
#     conn = get_db_connection()
#     # FIXED: Use parameterized query for INSERT
#     sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)"
#     params = (user.get('username'), user.get('email'), user.get('password'))
#     # Simulate query execution
#     print(f"Executing query: {sql} with params: {params}")
#     return execute_query(sql, params)

# # Vulnerability 6: SQL injection in an UPDATE statement
# def update_user_email(user_id, new_email):
#     conn = get_db_connection()
#     # FIXED: Use parameterized query for UPDATE
#     sql = "UPDATE users SET email = ? WHERE id = ?"
#     # Simulate query execution
#     print(f"Executing query: {sql} with params: ('{new_email}', {user_id})")
#     return execute_query(sql, (new_email, user_id))

# # Vulnerability 7: SQL injection in a DELETE statement
# def delete_user(user_id):
#     conn = get_db_connection()
#     # FIXED: Use parameterized query for DELETE
#     sql = "DELETE FROM users WHERE id = ?"
#     # Simulate query execution
#     print(f"Executing query: {sql} with params: ({user_id},)")
#     return execute_query(sql, (user_id,))

# # Vulnerability 8: SQL injection in a JOIN clause
# def get_user_orders(user_id):
#     conn = get_db_connection()
#     # FIXED: Use parameterized query in JOIN
#     sql = "SELECT o.* FROM orders o JOIN users u ON o.user_id = u.id WHERE u.id = ?"
#     # Simulate query execution
#     print(f"Executing query: {sql} with params: ({user_id},)")
#     return execute_query(sql, (user_id,))

# # Vulnerability 9: SQL injection in a subquery
# def get_users_with_orders(min_order_count):
#     conn = get_db_connection()
#     # FIXED: Use parameterized query in subquery
#     sql = "SELECT * FROM users WHERE id IN (SELECT user_id FROM orders GROUP BY user_id HAVING COUNT(*) > ?)"
#     # Simulate query execution
#     print(f"Executing query: {sql} with params: ({min_order_count},)")
#     return execute_query(sql, (min_order_count,))

# # Vulnerability 10: SQL injection with string formatting and conditional
# def filter_users(is_active, status=None):
#     conn = get_db_connection()
#     # FIXED: Build query safely with parameters
#     sql = "SELECT * FROM users WHERE status = ?"
#     param = "active" if is_active else status
#     # Simulate query execution
#     print(f"Executing query: {sql} with params: ('{param}',)")
#     return execute_query(sql, (param,))

# # --- CSRF Protection Example ---
# class SearchForm(FlaskForm):
#     """A simple form with CSRF protection enabled by default."""
#     query = StringField('Search Query', validators=[DataRequired()])
#     submit = SubmitField('Search')

# # @app.route('/secure-search', methods=['GET', 'POST'])
# # def secure_search():
# #     """
# #     This route is protected against CSRF.
# #     The form validation will fail if the CSRF token is missing or invalid.
# #     """
# #     form = SearchForm()
# #     if form.validate_on_submit():
# #         # Process the form data safely
# #         search_query = form.query.data
# #         # Here you would perform a safe search, e.g., using parameterized queries
# #         return jsonify({"status": "success", "query": search_query})

# #     # Render a form with the CSRF token included via form.hidden_tag()
# #     return render_template_string('''
# #         <form method="POST">
# #             {{ form.hidden_tag() }}
# #             {{ form.query.label }} {{ form.query() }}
# #             {{ form.submit() }}
# #         </form>
# #     ''', form=form)

# # Flask routes to demonstrate vulnerabilities
# @app.route('/users/<user_id>')
# def api_get_user(user_id):
#     # VULNERABLE: Directly passing user input to function
#     users = get_user_by_id(user_id)
#     return jsonify(users)

# @app.route('/users/search')
# def api_search_users():
#     # VULNERABLE: Directly passing request parameters
#     username = request.args.get('username', '')
#     role = request.args.get('role', '')
#     users = search_users(username, role)
#     return jsonify(users)

# @app.route('/users')
# def api_list_users():
#     # VULNERABLE: Directly passing request parameters
#     sort_column = request.args.get('sort', 'id')
#     users = list_users(sort_column)
#     return jsonify(users)

# @app.route('/users/create', methods=['POST'])
# def api_create_user():
#     # VULNERABLE: Directly passing request JSON
#     user = request.json
#     success = create_user(user)
#     return jsonify({"success": success})

# if __name__ == '__main__':
#     # FIXED: Do not run in debug mode in production. Control with an environment variable.
#     # Set FLASK_DEBUG=1 or FLASK_DEBUG=true in your environment to enable debug mode.
#     debug_mode = os.environ.get('FLASK_DEBUG', 'false').lower() in ['true', '1', 't']
#     app.run(debug=debug_mode)
