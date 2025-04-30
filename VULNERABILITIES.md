# Intentional Vulnerabilities for SonarQube Demo

This document describes the intentional vulnerabilities added to this project for demonstration purposes. These vulnerabilities are designed to be detected by SonarQube during code analysis.

## Purpose

The purpose of these vulnerabilities is to:
1. Demonstrate how SonarQube identifies security issues
2. Show the different types of vulnerabilities that can be detected
3. Provide a training resource for understanding common security issues
4. Test the effectiveness of your DevSecOps pipeline

## Vulnerability Files

The following files contain intentional vulnerabilities:

### JavaScript Vulnerabilities (`js/vulnerable.js`)
- Hard-coded credentials
- SQL Injection
- Cross-site Scripting (XSS)
- Insecure random values
- Potential infinite loops
- Unused variables and dead code
- Insecure object creation (eval)
- Insecure direct object reference
- Improper error handling
- Insecure timeout

### HTML Vulnerabilities (`vulnerable.html`)
- Inline JavaScript
- Inline CSS with duplicate selectors
- Missing CSRF protection
- Insecure iframe
- Outdated library references
- Insecure input handling
- Hard-coded credentials in comments
- Insecure links (javascript: protocol)
- Missing security headers
- Insecure form (using GET for sensitive data)

### CSS Vulnerabilities (`css/vulnerable.css`)
- Duplicate selectors
- Empty rules
- Overqualified selectors
- Missing standard properties
- Overuse of !important
- Too many font-size declarations
- Potentially unsafe CSS
- Unused CSS
- Too many colors
- Overly complex selectors

### Server-side Vulnerabilities (`server/vulnerable-server.js`)
- Hard-coded credentials
- Insecure file operations
- Command injection
- SQL Injection
- Insecure random values
- Weak cryptography
- No input validation
- Insecure cookie settings
- Information exposure in error messages
- Missing security headers

### Python Vulnerabilities (`python/vulnerable.py`)
- Hard-coded credentials
- Command injection
- Insecure file operations
- SQL Injection
- Insecure deserialization
- Weak cryptography
- Insecure random values
- Shell injection
- Information exposure
- Improper input validation

### SQL Vulnerabilities (`sql/vulnerable.sql`)
- Weak passwords
- Storing sensitive data without encryption
- Insecure table permissions
- Missing WHERE clauses
- Commented out code
- Duplicate indexes
- Unused indexes
- Cartesian products
- Hardcoded IP addresses
- Overly complex queries

### Docker Vulnerabilities (`docker/Dockerfile.vulnerable`)
- Using non-specific tags
- Running as root
- Exposing sensitive information in environment variables
- Installing unnecessary packages
- Using ADD instead of COPY
- Not removing package manager cache
- Insecure permissions (chmod 777)
- Hardcoded credentials
- Exposing too many ports
- Running multiple services in a container

## How to Use

1. Run SonarQube analysis on this project
2. Review the security issues detected by SonarQube
3. Understand the vulnerabilities and their potential impact
4. Learn how to fix these issues in real-world applications

## Important Note

**DO NOT USE THIS CODE IN PRODUCTION!** These vulnerabilities are intentionally created for educational purposes only. Using this code in a real application would create serious security risks.

## References

For more information on these vulnerabilities, refer to:
- [OWASP Top Ten](https://owasp.org/www-project-top-ten/)
- [CWE (Common Weakness Enumeration)](https://cwe.mitre.org/)
- [SonarQube Security Rules](https://rules.sonarsource.com/)
