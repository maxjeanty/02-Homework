





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
        switch (answer.view) {
            case "Departments":
                viewDepartments();
                break;
                
            case "Roles":
                viewRoles();
                break;
    
            case "Employees":
                viewEmployees();
                break;
            case "Exit":
                connection.end();
        }
    })

}







 function viewDepartments() {
    let query = "SELECT * FROM department";
    connection.query(query, function(err,res) {
        console.log("\n\n");
        console.table(res);
        reRun();
    })
    

}
// console logs a table of all the roles

 function viewRoles() {
    let query = "SELECT * FROM role";
    connection.query(query, function(err,res) {
        console.log("\n\n");
        console.table(res);  
        reRun();
    })
    
}
// console logs a table of all the employees
 function viewEmployees() {
    let query = "SELECT * FROM employee";
    connection.query(query, function(err,res) {
        console.log("\n\n");
        console.table(res);   
        reRun();
    })
   
}

