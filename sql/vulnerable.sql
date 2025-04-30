-- This SQL file contains intentional vulnerabilities for SonarQube to detect

-- Vulnerability 1: Creating a user with a weak password
CREATE USER 'admin'@'localhost' IDENTIFIED BY 'password123';
GRANT ALL PRIVILEGES ON *.* TO 'admin'@'localhost';

-- Vulnerability 2: Storing sensitive data without encryption
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(50) NOT NULL,  -- Storing plain text passwords
    credit_card VARCHAR(16),        -- Storing credit card numbers without encryption
    ssn VARCHAR(11)                 -- Storing SSNs without encryption
);

-- Vulnerability 3: Inserting sensitive data
INSERT INTO users (username, password, credit_card, ssn) 
VALUES ('john', 'john123', '4111111111111111', '123-45-6789');

-- Vulnerability 4: Insecure table permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON users TO 'app_user'@'%';

-- Vulnerability 5: Missing WHERE clause (could affect all rows)
UPDATE users SET active = true;
-- DELETE FROM logs;

-- Vulnerability 6: Commented out code
-- This was causing issues, will fix later
-- DELETE FROM users WHERE created_at < '2020-01-01';

-- Vulnerability 7: Duplicate indexes
CREATE INDEX idx_username ON users(username);
CREATE INDEX idx_user ON users(username);

-- Vulnerability 8: Unused index
CREATE INDEX idx_never_used ON users(created_at);

-- Vulnerability 9: Cartesian product (missing join condition)
SELECT u.username, o.order_id 
FROM users u, orders o;

-- Vulnerability 10: Hardcoded IP addresses
GRANT ALL PRIVILEGES ON app_db.* TO 'app_user'@'192.168.1.100';

-- Vulnerability 11: Overly complex query
SELECT 
    u.username,
    u.email,
    u.created_at,
    o.order_id,
    o.order_date,
    o.total_amount,
    p.product_name,
    p.price,
    c.category_name,
    a.street,
    a.city,
    a.state,
    a.zip_code
FROM 
    users u
JOIN 
    orders o ON u.id = o.user_id
JOIN 
    order_items oi ON o.order_id = oi.order_id
JOIN 
    products p ON oi.product_id = p.product_id
JOIN 
    categories c ON p.category_id = c.category_id
JOIN 
    addresses a ON u.address_id = a.address_id
WHERE 
    u.active = true
    AND o.status = 'completed'
    AND p.price > 100
    AND c.category_name IN ('Electronics', 'Computers', 'Accessories')
    AND a.state = 'CA'
ORDER BY 
    o.order_date DESC,
    p.price DESC;

-- Vulnerability 12: Insecure configuration
SET GLOBAL general_log = 'ON';
SET GLOBAL slow_query_log = 'ON';

-- Vulnerability 13: Temporary tables without cleanup
CREATE TEMPORARY TABLE temp_users AS SELECT * FROM users;
-- Missing DROP TABLE temp_users;

-- Vulnerability 14: Inefficient query patterns
SELECT * FROM large_table WHERE non_indexed_column = 'value';
