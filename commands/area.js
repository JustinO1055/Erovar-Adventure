module.exports={
    name: 'area',
    description: "Used to go between areas",
    execute(message, args){

        // regex to ensure that the user has inputted a number
        var regex = /\d+$/;
        if(!regex.test(args[0])){
            message.channel.send(`${message.author}, Please input a valid area and try again.\nUse \`adv help\` for help.`);
            return;
        // if trying to go into area 0. stop them
        } else if (args[0] == 0){
            message.channel.send(`${message.author}, You can not go into area 0. Area 0 is for tutorial. Please go to a valid area.\nUse \`adv help\` for help.`);
            return;
        }

        // query the database to get the users area/ max area
        var sql = `SELECT area, max_area FROM Users WHERE id = '${message.author.id}'`;
        connection.query(sql, (err, rows) => {
            if(err) throw err;

            // if the max area for the player is less than the area trying to go to, print error and return
            if(rows[0].max_area < args[0]){
                message.channel.send(`${message.author}, You have not unlocked this area yet. Your max area is ${rows[0].max_area}.\nUse \`adv help\` for help.`);
                return;
            } else if(args[0] == rows[0].area){
                message.channel.send(`${message.author}, You are already in this area!\nUse \`adv help\` for help.`);
                return;
            } else {

                // update area for user
                var sql2 = `UPDATE Users SET area = ${args[0]} WHERE id = '${message.author.id}'`;
                connection.query(sql2);

                // print message changing player into new area
                message.channel.send(`${message.author.username} has made the journey to get to area ${args[0]}`);
            }

        });

    }
}
