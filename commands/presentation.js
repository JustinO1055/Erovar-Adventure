
module.exports={
    name: 'presentation',
    description: "presentation",
    execute(message, args){

        let sql1 = `UPDATE Users SET level = 18, attack = 19, defence = 19, hp = 190, max_hp = 195, pickaxe = 'stone_pickaxe', axe = 'stone_axe', gold = gold + 500, admin = 1, xp = 15091 WHERE id = ${message.author.id}`;
        let sql2 = `UPDATE Inventory SET pebble = 500, stone = 500, copper_ore = 500, stick = 500, log = 500, pine_log = 500, cowhide = 50, attack_boost_a = 1 WHERE id = ${message.author.id}`;
                
        connection.query(sql1);
        connection.query(sql2);
        
    }
}
