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

-- VIEW ALL EMPLOYEES
SELECT employee.id, employee.firstName, employee.lastName, role.title, role.salary, department.name AS department
FROM employee 
LEFT JOIN role ON employee.roleId = role.Id 
LEFT JOIN department ON role.department_id = department.Id;

-- VIEW ALL EMPLOYEES BY DEPARTMENT
SELECT employee.id, employee.firstName, employee.lastName,role.title, role.salary
FROM employee
LEFT JOIN role ON employee.roleID = role.id
INNER JOIN department ON role.department_id = department.id
WHERE department.ID = 3;

-- -- VIEW ALL EMPLOYEES BY MANAGER
-- SELECT employee.managerId AS 'Manager ID', manager.firstName, manager.lastName AS 'Manager Name',
-- employee.id AS 'Employee ID', employee.firstName, employee.lastName 'Employee'
-- FROM employee employee
-- INNER JOIN employee manager ON employee.managerId = manager.id
-- WHERE employee.managerId IS NOT NULL
-- ORDER BY 'Manager Name';

--VIEW ALL ROLES
SELECT role.title AS "Title" , role.salary AS "Salary", department.name AS "Department"
FROM role
LEFT JOIN department ON role.department_id = department.id;
