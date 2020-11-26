var mysql = require("mysql");
var inquirer = require("inquirer");
var cTable = require("console.table");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "Buffalobills17.",
  database: "employee_roster_db",
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  userPrompt();
});

function userPrompt() {
  inquirer
    .prompt({
      type: "list",
      message: "What would you like to do?",
      name: "userAction",
      choices: [
        "View All Employees",
        "View All Employees by Department",
        "View All Roles",
        "View All Departments",
        "Add Employee",
        "Add Role",
        "Add Department",
        "Update Employee Role",
        "Exit",
      ],
    })
    .then(function (response) {
      switch (response.userAction) {
        case "View All Employees":
          viewAllEmployees();
          break;
        case "View All Employees by Department":
          employeeDepartmentView();
          break;
        case "View All Roles":
          viewAllRoles();
          break;
        case "View All Departments":
          viewAllDepartments();
          break;
        case "Add Employee":
          addEmployee();
          break;
        case "Add Role":
          addRole();
          break;
        case "Add Department":
          addDepartment();
          break;
        case "Update Employee Role":
          updateEmployeeRole();
          break;
        case "Exit":
          connection.end();
      }
    });
}
function viewEmployeesNoLoop() {
  const queryRequest =
    "SELECT employee.id AS 'Employee ID', employee.firstName AS 'First Name', employee.lastName AS 'Last Name', role.title AS 'Position', role.salary AS 'Salary', department.name AS 'Department' FROM employee LEFT JOIN role ON employee.roleId = role.Id LEFT JOIN department ON role.department_id = department.Id;";
  connection.query(queryRequest, (err, res) => {
    if (err) throw err;
    console.log(`\n**********\n\n`);
    console.table(res);
    console.log(`\n\n**********`);
  });
}
function viewAllEmployees() {
  const queryRequest =
    "SELECT employee.id AS 'Employee ID', employee.firstName AS 'First Name', employee.lastName AS 'Last Name', role.title AS 'Position', role.salary AS 'Salary', department.name AS 'Department' FROM employee LEFT JOIN role ON employee.roleId = role.Id LEFT JOIN department ON role.department_id = department.Id;";
  connection.query(queryRequest, (err, res) => {
    if (err) throw err;
    console.log(`\n**********\n\n`);
    console.table(res);
    console.log(`\n\n**********`);
    userPrompt();
  });
}
function employeeDepartmentView() {
  connection.query("SELECT * FROM department;", (err, res) => {
    if (err) throw err;
    // console.log(res);
    const departments = res.map((row) => ({
      value: row.id,
      name: row.name,
    }));
    inquirer
      .prompt({
        type: "list",
        message: "Which Department do you want to look at?",
        name: "department",
        choices: departments,
      })
      .then(function (response) {
        console.log(response);
        const queryRequest = `SELECT employee.id, employee.firstName, employee.lastName,role.title, role.salary FROM employee LEFT JOIN role ON employee.roleID = role.id INNER JOIN department ON role.department_id = department.id WHERE department.ID = ${response.department}`;
        connection.query(queryRequest, (err, res) => {
          if (err) throw err;
          console.log(`\n**********\n\n`);
          console.table(res);
          console.log(`\n\n**********`);
          userPrompt();
        });
      });
  });
}

function viewAllRoles() {
  connection.query(
    "SELECT role.title AS 'Title' , role.salary AS 'Salary', department.name AS 'Department' FROM role LEFT JOIN department ON role.department_id = department.id;",
    (err, res) => {
      if (err) throw err;
      console.log(`\n**********\n\n`);
      console.table(res);
      console.log(`\n\n**********`);
      userPrompt();
    }
  );
}

function viewAllDepartments() {
  connection.query(
    "SELECT department.name AS 'Name' FROM DEPARTMENT;",
    (err, res) => {
      if (err) throw err;
      console.log(`\n**********\n\n`);
      console.table(res);
      console.log(`\n\n**********`);
      userPrompt();
    }
  );
}

function addEmployee() {
  connection.query("SELECT * FROM role", (err, res) => {
    if (err) throw err;
    console.table(res);
    inquirer
      .prompt([
        {
          name: "first_Name",
          type: "input",
          message: "What is the new employee's first name?",
        },
        {
          name: "last_Name",
          type: "input",
          message: "What is the new employee's last name?",
        },
        {
          name: "role",
          type: "list",
          choices: function () {
            let roleArray = [];
            for (var i = 0; i < res.length; i++) {
              roleArray.push({
                name: res[i].title,
                value: res[i].id,
              });
            }
            return roleArray;
          },
          message: "What role will this employee fill?",
        },
        {
          name: "managerID",
          type: "input",
          message:
            "If the employee has a manager please type the manager's id number. If not, please press enter.",
        },
      ])
      .then(function (res) {
        let newEmployee = {
          firstName: res.first_Name,
          lastName: res.last_Name,
          roleID: res.role,
        };
        if (res.managerID) {
          newEmployee.managerID = res.managerID;
        }
        connection.query(
          "INSERT INTO employee SET ?",
          newEmployee,
          function (err) {
            if (err) throw err;
            console.log(
              `\n**********\n\nYou have added ${res.first_Name} ${res.last_Name}\n\n**********`
            );
            userPrompt();
          }
        );
      });
  });
}

function addRole() {
  connection.query("SELECT * FROM department", (err, res) => {
    if (err) throw err;
    console.table(res);
    inquirer
      .prompt([
        {
          name: "title",
          type: "input",
          message: "What is the name of the role you want to create?",
        },
        {
          name: "salary",
          type: "input",
          message: "What is the salary for this role?",
        },
        {
          name: "departmentName",
          type: "list",
          choices: function () {
            let departmentArray = [];
            for (var i = 0; i < res.length; i++) {
              departmentArray.push({ name: res[i].name, value: res[i].id });
            }
            return departmentArray;
          },
          message: "Which department does this role fall under?",
        },
      ])
      .then(function (response) {
        connection.query(
          "INSERT INTO role SET ?",
          {
            title: response.title,
            salary: response.salary,
            department_id: response.departmentName,
          },
          function (err) {
            if (err) throw err;
            console.log(
              `\n**********\n\nYou have added the ${response.title} role!\n\n**********`
            );
            userPrompt();
          }
        );
      });
  });
}

function addDepartment() {
  inquirer
    .prompt([
      {
        name: "departmentName",
        type: "input",
        message: "What is the name of the Department?",
      },
    ])
    .then(function (response) {
      connection.query(
        "INSERT INTO department set ?",
        { name: response.departmentName },
        function (err) {
          if (err) throw err;
          console.log(
            `\n**********\n You have created a new department called ${response.departmentName} \n**********`
          );
          userPrompt();
        }
      );
    });
}

function updateEmployeeRole() {
  viewEmployeesNoLoop();
  connection.query("SELECT * FROM role", (err, res) => {
    inquirer
      .prompt([
        {
          name: "employee_ID",
          type: "input",
          message: "What is the Employee ID number?",
        },
        {
          name: "roleName",
          type: "list",
          choices: function () {
            let roleArray = [];
            for (var i = 0; i < res.length; i++) {
              roleArray.push({
                name: res[i].title,
                value: res[i].id,
              });
            }
            return roleArray;
          },

          message: "Which role will this employee filL?",
        },
      ])
      .then(function (response) {
        connection.query(
          "UPDATE employee SET roleID=? WHERE id=?",
          [response.roleName, response.employee_ID],
          function (err) {
            if (err) throw err;
            console.log(
              `\n**********\n\nYou have updated the employee's role.\n\n**********`
            );
            userPrompt();
          }
        );
      });
  });
}
