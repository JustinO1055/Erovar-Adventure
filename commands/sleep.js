module.exports={
    name: 'sleep',
    description: "Allow the user to sleep once every 16 hours for a free heal of health",
    execute(message, args){

        // variables for time cooldown
        var seconds = 0;
        var minutes = 0;
        var hours = 16;

        // query the DB to see when last time sending this message was
        var sqlCooldown = `SELECT C.cd_sleep, U.admin FROM Cooldown C, Users U WHERE U.id = C.id AND C.id = '${message.author.id}'`;
        connection.query(sqlCooldown, (err, rowsCD) =>{
            if(err) throw err;

            var last_sleep = rowsCD[0]['cd_sleep'];
            // get current time
            var today = new Date();

            // get difference in time from now to last sent
            var diff = Math.abs(today - last_sleep);

            // convert the cooldown 
            var cooldown = ((((hours * 60) + minutes) * 60) + seconds)* 1000;

            // if still in cooldown
            if(diff < cooldown && rowsCD[0].admin != 1){
                // convert to seconds
                var cooldownL = (cooldown - diff) / 1000;
                var hourL = Math.floor(cooldownL / 3600);
                var minL = Math.floor((cooldownL % 3600) / 60);
                var secL = Math.floor((cooldownL % 60) % 60).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
                message.reply(`Please wait ${hours} hours before sending this command again. You have ${hourL} : ${minL} : ${secL} + left`);
            // time has passed
            } else if (diff >= cooldown || rowsCD[0].admin == 1){

                // query the db to see if the user has full hp
                let sqlCheck = `SELECT hp, max_hp FROM Users WHERE id = '${message.author.id}'`;
                connection.query(sqlCheck, (err, rows) =>{

                    // if the users hp is not full, let them sleep
                    if(rows[0].hp < rows[0].max_hp){
                        message.channel.send('You have slept... You awake to find your HP fully healed');
                        // update the last time sent in DB
                        var sql2 = `UPDATE Cooldown SET cd_sleep = NOW() WHERE id = ${message.author.id}`;
                        // heal hp
                        var sql3 = `UPDATE Users SET hp = max_hp WHERE id = ${message.author.id}`;
                        connection.query(sql2);
                        connection.query(sql3);
                        return;
                    } else {
                        message.channel.send('You tried to sleep... As your eyes were closing, you realized you already had full HP and decided to stay awake instead.\nType \`adv help\` for help');
                        return;
                    }

                });
            }

        });

    }

}
