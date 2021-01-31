module.exports={
    name: 'cooldown',
    description: "Show current cooldowns",
    execute(message, args){
        //Check if the user mentioned someone else, meaning they want to check another users cooldowns
        if(message.mentions.members.size > 0){
            id = message.mentions.users.first().id;
            username = message.mentions.users.first().username;
        } else {
            id = message.author.id;
            username = message.author.username;
        }

        //Get the users inventory
        let sql = `SELECT cd_gather FROM Cooldown WHERE id = '${id}'`;
        connection.query(sql, (err, rows) =>{
            if(err) throw err;

            //Check if the user has an inventory
            if(rows.length < 1){
                message.channel.send(`${username} has not started their adventure in Erovar!`)
            } else {
                for (let i = 0; i < rows.length; i++) {
                    // get the last command time
                    var last = rows[i]
                    // get current time
                    var today = new Date();
                    // get difference in time from now to last sent
                    var diff = Math.abs(today - last);
                    console.log(last);
                }
                
            }
        });
    }
}