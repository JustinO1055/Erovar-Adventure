module.exports={
    name: 'start',
    description: "Code to input the user into the databases to begin playing the bot",
    execute(message, args){

        // check if user exists
        let sql = `SELECT * FROM Users WHERE id = '${message.author.id}'`;
        connection.query(sql, (err, rows) =>{

            // if user already exists. print a message telling them so
            if(rows.length != 0){
                message.reply("You have already began your journey into Erovar.\nUse **adv h** for commands.");
            } else {
            // check to make sure they dont have an account
            message.channel.send("Welcome to Erovar. Please enjoy your journey. \n\nUse **adv h** for commands.");
            let sql2 = `INSERT INTO Users(id) VALUES ('${message.author.id}')`;
			let sql3 = `INSERT INTO Inventory(id) VALUES ('${message.author.id}')`;
			let sql4 = `INSERT INTO Cooldown(id) VALUES ('${message.author.id}')`;

            connection.query(sql2);
			connection.query(sql3);
			connection.query(sql4);

            }
        });
    }
}
