const {consumables} = require('../jsons/items.json');

module.exports = {
    name: 'heal',
    description: "allows the user to heal using health potions in their inventory",
    execute(message, args){

        // get hp for the user and amount of health potions
        let sql = `SELECT U.hp, U.max_hp, I.health_potion FROM Users U, Inventory I WHERE I.id = U.id AND U.id = '${message.author.id}'`;
        connection.query(sql, (err, rows) =>{
            if(err) throw err;

            //if the user has full hp, print a message and return
            if(rows[0]['hp'] >= rows[0]['max_hp']){
                message.channel.send(`${message.author}, you already have full hp!`);
                return;
            // if the user has no health potions
            } else if (rows[0]['health potion'] <= 0){
                message.channel.send(`${message.author}, you do not have any health potions to heal with!\nBuy some more from the shop \`adv shop\``);
                return;
            // otherwise user can heal
            } else{
                
                // prep 2 sql queries
                let sql2 = `UPDATE Users SET hp = max_hp WHERE id = '${message.author.id}'`;
                let sql3 = `UPDATE Inventory SET health_potion = health_potion -1 WHERE id = '${message.author.id}'`;
                // query the db
                connection.query(sql2);
                connection.query(sql3);

                // print message to user
                message.channel.send(`${message.author}, Your hp has been fully healed by drinking a ${consumables['health potion']['emoji']}`);
                return;

            }
        });

    }
}