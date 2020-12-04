var mysql = require("mysql");
var inquirer = require("inquirer");
var {init} = require('./server')

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







function reRun() {
    inquirer
    .prompt({
        type: "list",
        message: "Would you like to do more with the company?",
        name: "again",
        choices: [
            "yes",
            "no"
        ]
    }).then(function(ans) {
        if(ans.again === "yes"){
            init
        }
        else if(ans.again === "no"){
            connection.end();
        }
    })
}

module.exports = {
    
    reRun
 }
 