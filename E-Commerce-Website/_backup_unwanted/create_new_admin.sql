USE defaultdb;

INSERT INTO admin (email, password, name, phone) 
VALUES ('newadmin@gmail.com', 'admin123', 'New Admin', '9876543210')
ON DUPLICATE KEY UPDATE email=VALUES(email);

SELECT * FROM admin WHERE email = 'newadmin@gmail.com';
