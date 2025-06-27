#!/usr/bin/env python3
# This file contains intentional vulnerabilities for SonarQube to detect
# This is the SECURE version of the file.

import os
import subprocess
import pickle
import hashlib
import random
import secrets
import bcrypt
import base64

# Vulnerability 1: Hard-coded credentials
# FIXED: Credentials loaded from environment variables. Ensure they are not logged.
DB_USER = os.getenv("DB_USER", "default_user")
DB_PASSWORD = os.getenv("DB_PASSWORD", "default_password")
API_KEY = os.getenv("API_KEY", "default_api_key")

# Vulnerability 2: Command injection
def ping_host(host):
    # FIXED: Command injection vulnerability. Use subprocess.run with a list of arguments.
    # Input should be validated to be a valid IP or hostname.
    return subprocess.run(["ping", "-c", "4", host], capture_output=True, text=True, check=False)

# Vulnerability 3: Insecure file operations
def read_file(filename):
    # FIXED: Path traversal vulnerability. Sanitize filename and ensure it's within the base directory.
    base_dir = os.path.abspath("data")
    safe_filename = os.path.basename(filename)
    file_path = os.path.join(base_dir, safe_filename)

    if os.path.commonpath([base_dir]) != os.path.commonpath([base_dir, file_path]):
        raise ValueError("Attempted path traversal detected")

    with open(file_path, "r", encoding="utf-8") as f:
        return f.read()

# Vulnerability 4: SQL Injection
def get_user(user_id):
    # FIXED: SQL injection vulnerability. Use parameterized queries.
    query = "SELECT * FROM users WHERE id = ?"
    # Simulated database query with parameters
    return execute_query(query, (user_id,))

# Vulnerability 5: Insecure deserialization
def load_object(serialized_data):
    # FIXED: Insecure deserialization. Avoid pickle for untrusted data. Use a safe format like JSON.
    try:
        return json.loads(base64.b64decode(serialized_data))
    except (json.JSONDecodeError, TypeError):
        return None

# Vulnerability 6: Weak cryptography
def hash_password(password):
    # FIXED: Weak hashing algorithm (MD5). Use a strong, modern hashing algorithm like bcrypt.
    # A salt is generated and stored with the hash.
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt)

# Vulnerability 7: Insecure random values
def generate_token():
    # Insecure random value generation
    # FIXED: Use the secrets module for cryptographically secure random values.
    return secrets.token_hex(16)  # Generates a 32-character hex token

# Vulnerability 8: Shell injection
def execute_command(command):
    # Shell injection vulnerability
    # FIXED: Set shell=False and pass command as a list of arguments.
    # The 'command' variable should be a list, e.g., ['ls', '-l']
    if not isinstance(command, list):
        # For safety, if command is not a list, do not execute.
        raise TypeError("Command must be a list of arguments.")
    return subprocess.check_output(command, shell=False, text=True)

# Vulnerability 9: Information exposure
def process_data(data):
    try:
        # Intentional error
        result = 1 / 0 # This will still cause an error
    except Exception as e:
        # FIXED: Detailed error exposure. Log details internally, return a generic message.
        # In a real app, use a proper logger.
        print(f"Error processing data: {e}")
        return {"error": "An internal error occurred."}
    return {"status": "success", "result": result}

# Vulnerability 10: Improper input validation
def validate_age(age):
    # FIXED: Missing proper validation. Add type and range validation.
    try:
        age_int = int(age)
        if 0 < age_int < 120:
            return age_int
        return None # Age is out of range
    except (ValueError, TypeError):
        return None # Not a valid integer

# Helper functions to avoid actual errors
def execute_query(query, params=()):
    # This is a mock function. A real implementation would connect to a DB.
    print(f"Executing query: '{query}' with params: {params}")
    return []

# Example usage
if __name__ == "__main__":
    # Vulnerability 11: Insecure logging
    # FIXED: Do not log sensitive information.
    print("Application starting.")

    # Vulnerability 12: Unused variables
    # FIXED: Removed unused variable.

    # Vulnerability 13: Unreachable code
    # FIXED: Removed unreachable code.

    # Vulnerability 14: Infinite loop
    # Commented out to prevent actual infinite loop
    # while True:
    #     pass
