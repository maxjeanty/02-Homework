

function updateEmployee() {
    let query = `SELECT * FROM employee`
    connection.query(query, function(err, result) {
    // console.log(err, result);


        let employeeArray = [];
        let employeeFirst;
        for (let i = 0; i < result.length; i++) {
            employeeArray.push(`${result[i].first_name} ${result[i].last_name}`);
            employeeFirst = result[i].first_name;
        }
        
    let query2 =  `SELECT * FROM role`
    connection.query(query2, function(err, res) {
        // console.log(err, result);
    
    
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
        reRun();
    });
});
    });
});
}