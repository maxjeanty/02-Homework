var mysql = require("mysql");
var inquirer = require("inquirer");
var {reRun} = require('./rerun')


var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "company_db"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("Welcome");

});





 
 function addCompany() {
    inquirer
    .prompt({
        type: "list",
        message:"What would you like to add",
        name: "add",
        choices: [
            "Department",
            "Role",
            "Employee"
        ]

    }).then(function(answer) {
        switch (answer.add) {
            case "Department":
                addDepartment();
                break;
                
            case "Role":
                addRole();
                break;
    
            case "Employee":
                addEmployee();
                break;

        }
    })
};

// console logs a table of all the created departments.


// allows user to add a department to the company

 function addDepartment () {
    inquirer.prompt({
        type:"input",
        message:"What is the new department",
        name: "newDepartment"
    }).then(function(res){
        let query = `INSERT INTO department (name) VALUES (?)`
        connection.query(query,[res.newDepartment], function (err,res) {
            console.log(err, res);
            reRun();
        })
    });
   
};
// user can add new role to a department then decide on what the role is, the salary and what department it is for
 function addRole () {
    let query = `SELECT * FROM department`
    connection.query(query, function(err, result) {
    // console.log(err, result);


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
            reRun();
        })
    });
});

}
// user adds a new employee entering their first name, last name and then chooses a role based on what is available at the company
 function addEmployee () {
    let query = `SELECT * FROM role`
    connection.query(query, function(err, result) {
    // console.log(err, result);


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
            reRun();
        });
    });
    });
    

}

module.exports = {
    addCompany,
    addEmployee,
    addRole,
    addDepartment
 }
 