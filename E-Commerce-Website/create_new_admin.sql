USE srfab;

INSERT INTO admin (email, password, name, phone) 
VALUES ('newadmin@gmail.com', 'admin123', 'New Admin', '9876543210');

SELECT * FROM admin WHERE email = 'newadmin@gmail.com';
