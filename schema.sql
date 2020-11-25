DROP DATABASE IF EXISTS employee_roster_db;

CREATE DATABASE employee_roster_db;

USE employee_roster_db;

CREATE TABLE employee (
    id INTEGER NOT NULL AUTO_INCREMENT,
    firstName VARCHAR(50) NOT NULL,
    lastName VARCHAR(50) NOT NULL,
    roleID INTEGER NOT NULL,
    managerID INTEGER,
    PRIMARY KEY (id)
);

CREATE TABLE role (
    id INTEGER NOT NULL AUTO_INCREMENT,
    title VARCHAR(50) NOT NULL,
    salary DECIMAL(10,2),
    department_id INT NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE department (
    id INTEGER NOT NULL AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    PRIMARY KEY (id)
);


INSERT INTO department (name)
VALUES ("Sales"), ("Engineering"), ("Finance"), ("Legal");

SELECT * FROM department;

INSERT INTO role (title, salary, department_id)
VALUES ("Sales Lead", 100000, 1), ("Sales Person", 80000, 1), ("Lead Engineer", 150000, 2), ("Software Engineer", 120000, 2), ("Lead Accountant", 125000, 3),("Junior Accountant", 90000, 3), ("Legal Team Lead", 250000, 4), ("Lawyer", 190000, 4);

SELECT * FROM role;

INSERT INTO employee (firstName,lastName, roleId,managerId)
VALUES  ("John","Doe",1,null), ("Mike","Chan",2,1), ("Ashley", "Rodriguez", 3, null), ("Kevin","Tupik",4,3),("Kunal", "Singh", 5, null), ("Malia", "Brown", 6, 5), ("Sarah", "Lourd", 7, null), ("Tom", "Allen", 8, 7);

SELECT * FROM employee;

-- View all Employee info
SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, name AS Department
FROM employee 
LEFT JOIN role ON employee.role_id = role_id 
LEFT JOIN department ON role.department_id = department_id;

