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
        "View All Employees by Manager",
        "Add Employee",
        "Add Role",
        "Add Department",
        "View All Roles",
        "View All Departments",
        "Remove Employee",
        "Remove Role",
        "Remove Department",
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
        case "View All Employees by Manager":
          employeeManagerView();
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
        case "View All Roles":
          viewAllRoles();
          break;
        case "View All Departments":
            viewAllDepartments();
            break;
        case "Remove Employee":
            removeEmployee();
            break;
        case "Remove Role":
            removeRole();
            break;
        case "Remove Department":
            removeDepartment();
            break;
        case "Exit":
            connection.end();
        

      }
    });
}

function viewAllEmployees(){
    const queryRequest = "SELECT employee.id, employee.firstName, employee.lastName, role.title, role.salary, department.name AS department FROM employee LEFT JOIN role ON employee.roleId = role.Id LEFT JOIN department ON role.department_id = department.Id;"
    connection.query(queryRequest,(err,res) => {
        if (err) throw (err);
        console.table(res);
        userPrompt();
    });
}
function employeeDepartmentView(){
    connection.query("SELECT * FROM department;", (err,res) => {
        if (err) throw err;
        console.log(res);
        const departments = res.map((row) => ({
            value: row.id,
            name: row.name,
        }));
        inquirer.prompt({
            type: "list",
            message: "Which Department do you want to look at?",
            name: "department",
            choices: departments,
        }).then(function(response){
            console.log(response);
            const queryRequest= `SELECT employee.id, employee.firstName, employee.lastName,role.title, role.salary FROM employee LEFT JOIN role ON employee.roleID = role.id INNER JOIN department ON role.department_id = department.id WHERE department.ID = ${response.department}`;
            connection.query(queryRequest, (err,res) => {
                if (err) throw err;
                console.table(res);
                userPrompt();
            });
            
        });
        
    });
    
};

function employeeManagerView(){

    userPrompt();
};

function addEmployee(){

    userPrompt();
};

function addRole(){

    userPrompt();
};

function addDepartment(){
    inquirer.prompt([
        {
            name: "departmentName",
            type: "input",
            message: "What is the name of the Department?"
        },
    ]).then(function(response){
        connection.query("INSERT INTO department set ?", {name: response.departmentName}, function(err){
            if (err) throw err;
            console.log( `\n**********\n You have created a new deparment called ${response.departmentName} \n**********\n`);
            userPrompt();
        });
    });
   
};
function viewAllRoles(){
    connection.query("SELECT role.title AS 'Title' , role.salary AS 'Salary', department.name AS 'Department' FROM role LEFT JOIN department ON role.department_id = department.id;",(err,res) => {
        if (err) throw err;
        console.table(res);
        userPrompt();
    });
};


function viewAllDepartments(){
    connection.query("SELECT department.name AS 'Name' FROM DEPARTMENT;", (err,res) => {
        if (err) throw err;
        console.table(res);
        userPrompt();
    });
    
};

function removeEmployee (){

    userPrompt();
}

function removeRole (){

    userPrompt();
}

function removeDepartment (){

    userPrompt();
}
