var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "company_db"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("Your Company Database");
  init();
});

// starts inital prompt on what the user would like to do with the company. Depending on the response the respective function is called. 
function init() {
    inquirer.prompt({
        type:"list",
        message:"What would you like to do with company?",
        name: "action",
        choices: [
            "View Departments, roles or employees",
            "Add Departments, roles, or employees",
            "Update Employee"
        ]
    }).then(function(answer) {
        if(answer.action === "View Departments, roles or employees") {
            viewCompany();
        } else if(answer.action === "Add Departments, roles, or employees") {
            addCompany();
        } else if(answer.action === "Update Employee") {
            updateEmployee();
        } else {}
    })
}

//
// VIEW CODE
//

// function asks what part of the company they would like to view, selected answer will bring up information respective to what the user has chosen
function viewCompany(){
    inquirer.prompt({
        type:"list",
        message: "What would you like to view?",
        name: "view",
        choices: [
            "Departments",
            "Roles",
            "Employees",
        ]
    }).then(function(answer) {
        if(answer.view === "Departments") {
            viewDepartments();
        } else if(answer.view === "Roles") {
            viewRoles();
        } else if(answer.view === "Employees") {
            viewEmployees();
        } else {}
    })

}

function viewDepartments() {
    let query = "SELECT * FROM department";
    connection.query(query, function(err,res) {
        console.log("\n\n");
        console.table(res);
        startOver();
    })
}

function viewRoles() {
    let query = "SELECT * FROM role";
    connection.query(query, function(err,res) {
        console.log("\n\n");
        console.table(res);
        startOver();
    })
}

function viewEmployees() {
    let query = "SELECT * FROM employee";
    connection.query(query, function(err,res) {
        console.log("\n\n");
        console.table(res);
        startOver();
    })
}

//
// ADD CODE
//

// if the user chose add in initial prompt this allows them to choose whether to add a department, employee or role
function addCompany() {
    inquirer
    .prompt({
        type: "list",
        message:"Which would you like to add?",
        name: "add",
        choices: [
            "Department",
            "Role",
            "Employee"
        ]

    }).then(function(answer) {
        if(answer.add === "Department") {
            addDepartment();
        } else if(answer.add === "Role") {
            addRole();
        } else if(answer.add === "Employee") {
            addEmployee();
        } else {}
    })
};

// allows user to add a department to the company
function addDepartment () {
    inquirer.prompt({
        type:"input",
        message:"What is the new department",
        name: "newDepartment"
    }).then(function(res){
        let query = `INSERT INTO department (name) VALUES (?)`
        connection.query(query,[res.newDepartment], function (err,res) {
            startOver();
        })
    });
   
};

// user can add new role to a department then decide on what the role is, the salary and what department it is for
function addRole () {
    let query = `SELECT * FROM department`
    connection.query(query, function(err, result) {
        let departmentArray = [];
            for (let i = 0; i < result.length; i++) {
                departmentArray.push(result[i].name);
            }

        inquirer.prompt([
            {
            type:"input",
            message:"What is the new role",
            name: "newRole",
            },

            {
            type:"input",
            message:"What is the new salary",
            name: "newSalary",
            },

            {
            type:"list",
            message:"What is the department of the role",
            choices: departmentArray,
            name: "roleDepartment",
            }

        ]).then(function(ans){
            let departmentID;
            for(let i = 0; i < result.length; i++) {
                if(result[i].name === ans.roleDepartment) {
                    departmentID = result[i].id;
                }
            }
            let query = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`
            connection.query(query,[ans.newRole, ans.newSalary, departmentID], function (err,res) {
                if (err) throw err;
                startOver();
            })
        });
    });
}

// user adds a new employee entering their first name, last name and then chooses a role based on what is available at the company
function addEmployee () {
    let query = `SELECT * FROM role`
    connection.query(query, function(err, result) {
        let roleArray = [];

        for (let i = 0; i < result.length; i++) {
            roleArray.push(result[i].title);
        }
        inquirer.prompt([
            {
            type:"input",
            message:"What is the new employee's first name?",
            name: "newFirst",
            },

            {
            type:"input",
            message:"What is the new employee's last name?",
            name: "newLast",
            },

            {
            type:"list",
            message:"What is the role of the new employee",
            choices: roleArray,
            name: "employeeRole",
            }

        ]).then(function(ans){
            let roleID;
            for(let i = 0; i < result.length; i++) {
                if(result[i].title === ans.employeeRole) {
                    roleID = result[i].id;
                }
            }
            let query = `INSERT INTO employee (first_name, last_name, role_id) VALUES (?, ?, ?)`
            connection.query(query,[ans.newFirst, ans.newLast, roleID], function (err,res) {
                if (err) throw err;
                startOver();
            });
        });
    });
}

//
// UPDATE CODE
//

// supposed to update employee role...not quite there yet
function updateEmployee() {
    let query = `SELECT * FROM employee`
    connection.query(query, function(err, result) {

        let employeeArray = [];
        let employeeFirst;
        for (let i = 0; i < result.length; i++) {
            employeeArray.push(`${result[i].first_name} ${result[i].last_name}`);
            employeeFirst = result[i].first_name;
        }
        
        let query2 =  `SELECT * FROM role`
        connection.query(query2, function(err, res) {
            let roleArray = [];
            let updatedRole;
            for (let i = 0; i < res.length; i++) {
                roleArray.push(res[i].title);
                updateRole = res[i].title;
            }
        
            inquirer
                .prompt([
                {
                    type: "list",
                    message:"Which employee do you want to update",
                    name: "update",
                    choices: employeeArray
                },
                {
                    type: "list",
                    message: "What is the employee's new role",
                    name:"updateRole",
                    choices: roleArray
                }

            ]).then(function(ans){
                console.log(ans);
                let roleID;
                for(let i =0; i < res.length; i++) {
                    if(res[i].name === ans.roleArray) {
                        roleID = res[i].id;
                    }
                }

                let query = `UPDATE employee SET role_id = ? WHERE first_name = ?`
                connection.query(query,[roleID, updatedRole, employeeFirst], function (err,res) {
                    if (err) throw err;
                    startOver();
                });
            });
        });
    });
}

// allows server to stay open and let them continue to view/add/update company or ends connection if no is selected
function startOver() {
    inquirer
    .prompt({
        type: "list",
        message: "Would you like make more changes?",
        name: "again",
        choices: [
            "Yes",
            "No"
        ]
    }).then(function(answer) {
        if(answer.again === "Yes"){
            init();
        }
        else if(answer.again === "No"){
            connection.end();
        }
    })
}