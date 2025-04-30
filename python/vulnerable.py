#!/usr/bin/env python3
# This file contains intentional vulnerabilities for SonarQube to detect

import os
import subprocess
import pickle
import hashlib
import random
import base64

# Vulnerability 1: Hard-coded credentials
DB_USER = "admin"
DB_PASSWORD = "password123"
API_KEY = "1234567890abcdef"

# Vulnerability 2: Command injection
def ping_host(host):
    # Command injection vulnerability
    cmd = f"ping -c 4 {host}"
    return os.system(cmd)

# Vulnerability 3: Insecure file operations
def read_file(filename):
    # Path traversal vulnerability
    with open(f"data/{filename}", "r") as f:
        return f.read()

# Vulnerability 4: SQL Injection
def get_user(user_id):
    # SQL injection vulnerability
    query = f"SELECT * FROM users WHERE id = {user_id}"
    # Simulated database query
    return execute_query(query)

# Vulnerability 5: Insecure deserialization
def load_object(serialized_data):
    # Insecure deserialization
    return pickle.loads(base64.b64decode(serialized_data))

# Vulnerability 6: Weak cryptography
def hash_password(password):
    # Weak hashing algorithm (MD5)
    return hashlib.md5(password.encode()).hexdigest()

# Vulnerability 7: Insecure random values
def generate_token():
    # Insecure random value generation
    return random.random()

# Vulnerability 8: Shell injection
def execute_command(command):
    # Shell injection vulnerability
    return subprocess.check_output(command, shell=True)

# Vulnerability 9: Information exposure
def process_data(data):
    try:
        # Intentional error
        result = 1 / 0
    except Exception as e:
        # Detailed error exposure
        error_details = {
            "error": str(e),
            "traceback": str(e.__traceback__),
            "data": data
        }
        return error_details

# Vulnerability 10: Improper input validation
def validate_age(age):
    # Missing proper validation
    if age:
        return int(age)
    return 0

# Helper functions to avoid actual errors
def execute_query(query):
    return []

# Example usage
if __name__ == "__main__":
    # Vulnerability 11: Insecure logging
    print(f"Starting with credentials: {DB_USER}:{DB_PASSWORD}")
    
    # Vulnerability 12: Unused variables
    unused_var = "This variable is never used"
    
    # Vulnerability 13: Unreachable code
    if False:
        print("This will never execute")
    
    # Vulnerability 14: Infinite loop
    # Commented out to prevent actual infinite loop
    # while True:
    #     pass
