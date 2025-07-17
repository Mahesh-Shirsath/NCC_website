-- Delete existing demo accounts if they exist
DELETE FROM users WHERE email IN ('admin@ncc.edu', 'student@example.com');

-- Create admin account with password: admin123
-- Hash generated with bcrypt, 12 rounds
INSERT INTO users (email, password_hash, role, full_name, phone) VALUES (
  'admin@ncc.edu',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6uk6L7Q1NO',
  'admin',
  'Admin User',
  '9876543210'
);

-- Create student account with password: student123  
-- Hash generated with bcrypt, 12 rounds
INSERT INTO users (email, password_hash, role, full_name, phone) VALUES (
  'student@example.com',
  '$2a$12$QYHh9/aSQVZZn.C5a6sBZOXcJ5C6UmKgMnL6pRX0YczHEVCnFn7Oa',
  'student',
  'Demo Student',
  '1234567890'
);

-- Verify accounts were created
SELECT email, role, full_name FROM users WHERE email IN ('admin@ncc.edu', 'student@example.com');
