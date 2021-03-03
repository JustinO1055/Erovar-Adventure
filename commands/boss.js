// to allow for embeds
const Discord = require('discord.js');
const Client  = new Discord.Client();

// include the json file that holds all of the monsters names, emoji codes and information
const MONSTERS = require('../jsons/monsters.json');

//Include the js file with functions, that includes the playerDeath function
var functions = require('../functions.js');

//Include the js file that contains the player class
var playerClass = require('../classes/player.js');

//Include the js file that contains the playerMoves class
var playerMoveClass = require('../classes/playerMoves.js');

module.exports={
    name: 'boss',
    description: "Used for fighting the boss of the area in order to unlock the next area",
    execute(message, args) {

        // variables for time cooldown
        var seconds = 0;
        var minutes = 0;
        var hours = 6;

        //Declare variable to store all the player information of those in the boss
        var players = [];

        //Declare sql statemnt to get all required information for dungeon
        var sql = `SELECT U.id, C.cd_boss, U.admin, U.area, U.max_area, U.level, U.sword, U.shield, U.armor, U.axe, U.pickaxe, U.hp, U.max_hp, U.attack, U.defence FROM Cooldown C JOIN Users U ON U.id = C.id WHERE C.id = '${message.author.id}'`;

        //Check to ensure the arguments passed are mentions
        for(i = 0; i < args.length; i++){
            // make sure the first argument is the user
            let regex = /^<@!?(\d+)>$/;
            if(!regex.test(args[i])){
                message.reply(`Invalid order for arguments. The proper use of this command is \`adv boss [@person] [@person] [@person]\``);
                return;
            }
                            
        }

        //If the player attempts to mention other players, get all the required information and ensure there is not more than 3 mentions
        if(args.length > 0 && args.length < 4){

            message.mentions.users.forEach(member =>{
                sql += ` OR C.id = '${member.id}'`;
                // get id of first argument
                // if it is not a person. print error message
                /* try{
                    
                } catch(err) {
                    message.reply(`Unable to get player information. Please ensure that you are mentioning the people you want to fight the boss with.`);
                    return;
                } */
            });

        } else if(args.length == 0){

        } else{
            message.reply(`Bosses can not be done with more than 4 people. Please try again with at most 4`);
            return;
        }

        sql += `ORDER BY case when C.id = '${message.author.id}' then 1 else 2 end asc`;

        connection.query(sql, (err, rows) =>{
            if(err) throw err;

            var areaChallenge = rows[0].max_area;

            if(areaChallenge == 0){
                if(rows.length > 1){
                    message.reply(`This boss can only be challenged alone. \nPlease check \`adv help boss <area #>\` for more information.`);
                    return;
                }
            } else if(areaChallenge == 1 || areaChallenge == 2){
                if(rows.length == 1){
                    message.reply(`This boss cannot be challenged alone. \nPlease check \`adv help boss <area #>\` for more information.`);
                    return;
                }
            }

            for(p in rows){
                const User = client.users.cache.get(rows[p].id); // Getting the user by ID.

                //Check if player is in the right area
                if(rows[p].area != areaChallenge || rows[p].max_area != areaChallenge){
                    message.reply(`Not all players are in the correct area. \nPlease check \`adv help boss <area #>\` for more information.`);
                    return;
                }
            
                //Check if the players boss command is on cd
                // get the last command time
                var last = rows[p]['cd_boss'];
                // get current time
                var today = new Date();
                // get difference in time from now to last sent
                var diff = Math.abs(today - last);
                // convert the cooldown 
                var cooldown = ((((hours * 60) + minutes) * 60) + seconds)* 1000;

                // if the time is less than the cooldown
                if(diff < cooldown && rows[p].admin != 1){
                    // convert to seconds
                    var cooldownL = (cooldown - diff) / 1000;
                    var hourL = Math.floor(cooldownL / 3600);
                    var minL = Math.floor((cooldownL % 3600) / 60);
                    var secL = Math.floor((cooldownL % 60) % 60).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
                    message.channel.send(`${User} please wait ${hours} hours before sending this command again. You have ${hourL}:${minL}:${secL} left`);
                    return;
                }

                players.push(new playerClass(rows[p].id, User.username, rows[p].hp, rows[p].max_hp, rows[p].attack, rows[p].defence))
            }

            // do a switch statement based on area to get the right dungeon
            switch(areaChallenge){
                case 0:{                         
                    // ensure the user has all of the correct requirements.
                    // prep error message for if they do not have the requirements
                    let errorMessage = "";
                    valid = true;
                    // check the users level to be greater than 3
                    if(rows[0].level < 3) {
                        errorMessage += `**Level:** 3 :x:\n`;
                        valid = false;
                    } else {
                        errorMessage += `**Level:** 3 :white_check_mark:\n`;
                    }
                    // make sure user has basic sword
                    if(rows[0].sword != 'basic_sword') {
                        errorMessage += `**Sword:** Basic Sword ${functions.getEmoji('basic_sword')} :x:\n`;
                        valid = false;
                    } else {
                        errorMessage += `**Sword:** Basic Sword ${functions.getEmoji('basic_sword')} :white_check_mark:\n`;
                    }
                    // make sure user has basic shield
                    if(rows[0].shield != 'basic_shield') {
                        errorMessage += `**Shield:** Basic Shield ${functions.getEmoji('basic_shield')} :x:\n`;
                        valid = false;
                    } else {
                        errorMessage += `**Shield:** Basic Shield ${functions.getEmoji('basic_shield')} :white_check_mark:\n`;
                    }
                    // make sure user has stone axe
                    if(rows[0].axe != 'stone_axe') {
                        errorMessage += `**Axe:** Stone Axe ${functions.getEmoji('stone_axe')} :x:\n`;
                        valid = false;
                    } else {
                        errorMessage += `**Axe:** Stone Axe ${functions.getEmoji('stone_axe')} :white_check_mark:\n`;
                    }
                    // make sure user has stone pickaxe
                    if(rows[0].pickaxe != 'stone_pickaxe') {
                        errorMessage += `**Pickaxe:** Stone Pickaxe ${functions.getEmoji('stone_pickaxe')} :x:\n`;
                        valid = false;
                    } else {
                        errorMessage += `**Pickaxe:** Stone Pickaxe ${functions.getEmoji('stone_pickaxe')} :white_check_mark:\n`;
                    }

                    // if the user does not meet requirements. send the error
                    if(!valid){
                            // create the embed to send
                            const errorEmbed = new Discord.MessageEmbed()
                            .setColor('#CC0000')
                            .setTitle('Error')
                            .addFields(
                                { name: `Lacking Boss Requirements:`, value: errorMessage},
                            );
                            message.channel.send(errorEmbed);
                            return;
                    }

                    // if the player is prepared, prompt user if they are ready to start the boss fight
                    // create the embed to send
                    const ready = new Discord.MessageEmbed()
                    .setColor('#0A008C')
                    .setTitle('Boss Fight')
                    .addFields(
                        { name: `Description`, value: `Welcome to the first of many boss fights you will encounter throughout your journey through Erovar.\n
                        This is the tutorial boss fight, you will be fighting this boss alone, in the future you might need to team up with fellow adventurers in order to take down the tougher bosses.\n
                        This is a strategy based boss, this boss has a 'tell' before it attacks. You must decipher his tell to defeat him. Each successful attack to the boss will deal some damage, if you attack unsuccessfully, the boss will instead attack you.\n
                        Good luck. Upon defeating the boss, you will be granted access to the greater areas in area 1.`},
                        { name: "Ready", value: `If you are ready, type \`yes\` to begin the fight. If you need more time to prepare, type \`no\` to cancel.`}
                    );

                    let filter = m => m.author.id === players[0].id && (m.content.toLowerCase() == 'yes' || m.content.toLowerCase() == 'no');
                    message.channel.send(ready).then(() => {
                        message.channel.awaitMessages(filter, {max: 1, time: 30000, errors: ['time'] }).then(mes => {
                            var command = mes.first().content.toLowerCase();
                            if (command == 'yes') {
                                boss0(players[0], message);
                                for(i = 0; i < players.length; i++){
                                    // update the cooldown in database
                                    var sql2 = `UPDATE Cooldown SET cd_boss = NOW() WHERE id = '${players[i].id}'`;
                                    connection.query(sql2);
                                }
                            } else if (command == 'no') {
                                message.channel.send("Boss fight canceled");
                            }
                            return;
                        })
                        .catch(collected => {
                            message.channel.send(`Boss fight canceled. ${message.author} has taken too long to respond.`);
                        });
                    });
                    break;
                }
                case 1:
                case 2:{
                    //Call boss 1 function
                    damageTestBoss(players, message, areaChallenge);                    
                    break;
                }
                default:{
                    message.channel.send(`There is currently no boss for this area. Please check back later!`);
                    break;
                }
            }
        });
    }
}

async function boss0(player, message){

    // update the cooldown in database
    var sql2 = `UPDATE Cooldown SET cd_boss = NOW() WHERE id = '${message.author.id}'`;
    connection.query(sql2);

    // store boss into variable for easier access
    var boss;
    for(b in MONSTERS['area0']['boss']){
        boss = MONSTERS['area0']['boss'][b];        
    }

    // update the user stats
    userStats = { name: `${message.author.username}'s Stats:`, value: `**HP**: ${player.hp[0]}/${player.hp[1]}\n**Att**: ${player.attack}\n**Def**: ${player.defence}`, inline: true };
    // set the stats for the boss for the embed
    bossStats = { name: `Boss ${boss.name} ${boss.emoji} Stats:`, value: `**HP**: ${boss.hp}/${boss.hp}\n`, inline: true};

    //Declare player moves for reading to embed
    var playerMoves = { name: "Your Moves:", value: "What are you going to do?\n\`Trap\` to throw a bear trap at the bear.\n\`Tomahawk\` to throw your axe at the bear.\n\`Climb\` To climb a nearby tree.\n\`Block\` to use your shield to block the bear."};

    // randomly generate the move for the boss
    var bossMove = boss.moves[functions.randomInteger(0,3)];
    var bossMoveMsg = { name: 'Hint', value : `The ${boss.name} appears to be preparing to ${bossMove}`};

    var outcome;

    // create the embed to send
    const bossEmbed = new Discord.MessageEmbed()
    .setColor('#0A008C')
    .setTitle('Boss Fight')
    .addFields(
        userStats,
        bossStats,
        playerMoves,
        bossMoveMsg        
    );

    //Declare variables to track current HP for player and monster
    var playerCurrentHP = player.hp[0];
    var bossCurrentHP = boss.hp;

    // set up listening for response
    let filter = m => m.author.id === message.author.id && (m.content.toLowerCase() == 'trap' || m.content.toLowerCase() == 'tomahawk' || m.content.toLowerCase() == 'climb' || m.content.toLowerCase() == 'block');
    while(playerCurrentHP > 0 && bossCurrentHP > 0) {
        message.channel.send(bossEmbed)
        await message.channel.awaitMessages(filter, {max: 1, time: 30000, errors: ['time'] }).then(mes => {
            
            // get the attack choice from user
            attack = mes.first().content.toLowerCase();

            let outcomeMsg;

            // figure out the outcome for the moves selected
            // 1 move is good, 1 is okay, 2 are bad
            /*
            *
            *   Boss uses Scratch:      Good: Block
            *                           Okay: Trap 
            *                           Bad: Climb, Tomahawk
            * 
            *   Boss uses Bite:         Good: Tomahawk. 
            *                           Okay: Climb
            *                           Bad: Trap, Block
            * 
            *   Boss uses Stomp:        Good: Trap.
            *                           Okay: Block
            *                           Bad: Climb, Tomahawk
            * 
            *   Boss uses Hibernate:    Good: Climb: 
            *                           Okay: Tomahawk. 
            *                           Bad: Trap, Block
            * 
            */

            //if else block to find the bosses move
            if(bossMove == 'Scratch'){
                // if else block to find the players move
                // compute the outcome based off the chosen moves
                if(attack == 'trap'){
                    // okay outcome, both lose 5 hp
                    bossCurrentHP -= 5;
                    playerCurrentHP -= 5;
                    outcomeMsg = `As the ${boss.name} went to scratch you, you threw a trap partially trapping the bears hand and doing a bit of damage to the ${boss.name} as it still swings and hits you.\n-5 :heart: ${message.author.username}, -5 :heart: ${boss.emoji}`;
                    
                } else if(attack == 'tomahawk'){        
                    // bad outcome, player loses 10 hp
                    playerCurrentHP -= 10;
                    outcomeMsg = `You threw your ${functions.getEmoji('stone_axe')} at the swinging ${boss.name}, he swats it away and scratches you anyway.\n-10 :heart: ${message.author.username}`;

                } else if(attack == 'climb'){
                    // bad outcome
                    playerCurrentHP -= 10;
                    outcomeMsg = `You decided to try and climb the nearby tree to avoid the ${boss.name}s scratch. Little did you know that he is a good climber as he follows you up the tree and scratches you.\n-10 :heart: ${message.author.username}`;

                } else if(attack == 'block'){
                    // good outcome
                    bossCurrentHP -= 10;
                    outcomeMsg = `You use your ${functions.getEmoji('basic shield')} to block the swiping ${boss.name}. The shield manages to break one of the bears claws!\n-10 :heart: ${boss.emoji}`;
                    
                }


            } else if (bossMove == 'Bite'){
                // if else block to find the players move
                // compute the outcome based off the chosen moves
                if(attack == 'trap'){
                    // bad outcome, player losers 10 hp
                    playerCurrentHP -= 10;
                    outcomeMsg = `You decided to throw the trap at the ${boss.name} as it was trying to bite you, however you missed and the ${boss.name} bites you.\n-10 :heart: ${message.author.username}`;
                    
                } else if(attack == 'tomahawk'){
                    // good outcome
                    bossCurrentHP -= 10;
                    outcomeMsg = `You threw your ${functions.getEmoji('stone_axe')} and the ready to bite ${boss.name}, he bites the tomahawk, cutting his mouth and and stopping him from biting you.\n-10 :heart: ${boss.emoji}`;

                } else if(attack == 'climb'){
                    // okay outcome
                    playerCurrentHP -= 5;
                    bossCurrentHP -= 5;
                    outcomeMsg = `You decided to try and climb the nearby tree to avoid the ${boss.name}s bite. The bear accidently bites the tree hurting his teeth but making you fall down. \n-5 :heart: ${message.author.username}, -5 :heart: ${boss.emoji}`;

                } else if(attack == 'block'){
                    // bad outcome
                    playerCurrentHP -= 10;
                    outcomeMsg = `You attempt you use you ${functions.getEmoji('basic shield')} to block the hungry ${boss.name}. The ${boss.name} does not care as he eats the shield and then bites you.\n-10 :heart: ${message.author.username}`;
                    
                }

            
            } else if (bossMove == 'Stomp'){
                // if else block to find the players move
                // compute the outcome based off the chosen moves
                if(attack == 'trap'){
                    // good outcome, boss loses 10 hp
                    bossCurrentHP -= 10;
                    outcomeMsg = `You threw the trap in the running path of the ${boss.name} causing him to step on it instead of you. The bear was badly hurt.\n -10 :heart: ${boss.emoji}`;
                    
                } else if(attack == 'tomahawk'){
                    // bad outcome
                    playerCurrentHP -= 10;
                    outcomeMsg = `You threw your ${functions.getemoji('stone_axe')} at the charging ${boss.name}, however you missed and the ${boss.name} stomps on you.\n-10 :heart: ${message.author.username}`;

                } else if(attack == 'climb'){
                    // bad outcome
                    playerCurrentHP -= 10;
                    outcomeMsg = `You decided to try and climb a tree to avoid the charging ${boss.name}. The ${boss.name} did not care that you climbed the tree, climbing after you and stomping you out of the tree.\n-10 :heart: ${message.author.username}`;

                } else if(attack == 'block'){
                    // okay outcome
                    playerCurrentHP -= 5;
                    bossCurrentHP -= 5;
                    outcomeMsg = `You hold your ${functions.getEmoji('basic shield')} up to block the stomping ${boss.name}. You slightly get squished as the bear twists his elbow on you, slightly hurting himself. \n-5 :heart: ${message.author.username}, -5 :heart: ${boss.emoji}`;
                    
                }

            } else if(bossMove == 'Hibernate'){
                // if else block to find the players move
                // compute the outcome based off the chosen moves
                if(attack == 'trap'){
                    // bad outcome
                    playerCurrentHP -= 10;
                    outcomeMsg = `You threw the trap at the hibernating ${boss.name}, this wakes him up causing him to attack you.\n-10 :heart: ${message.author.username}`;
                    
                } else if(attack == 'tomahawk'){
                    // okay outcome
                    playerCurrentHP -= 5;
                    bossCurrentHP -= 5;
                    outcomeMsg = `You got a good distance away from the ${boss.name} and threw the ${functions.getEmoji('stone_axe')} hitting him in the head causing him to chase after you to attack.\n-5 :heart: ${message.author.username}, -5 :heart: ${boss.emoji}`;
                } else if(attack == 'climb'){
                    // good outcome
                    bossCurrentHP -= 10;
                    outcomeMsg = `You decided to climb the tree for an ariel attack on the hibernating ${boss.name}. Upon hitting the ${boss.name}, he was left confused and unaware of what had happened. \n-10 :heart: ${boss.emoji}`;

                } else if(attack == 'block'){
                    //bad outcome
                    playerCurrentHP -= 10;
                    outcomeMsg = `You put your ${functions.getEmoji('basic shield')} up to block... the hibernating ${boss.name}. After a while, you get sleepy and doze off as the ${boss.name} wakes up and attacks you. \n-10 :heart: ${message.author.username}`;

                }

            }

            outcome = { name: `Outcome`, value: outcomeMsg, inline: true };

            // update the user stats
            userStats = { name: `${message.author.username}'s Stats:`, value: `**HP**: ${playerCurrentHP}/${player.hp[1]}\n**Att**: ${player.attack}\n**Def**: ${player.defence}`, inline: true };
            // set the stats for the boss for the embed
            bossStats = { name: `Boss ${boss.name} ${boss.emoji} Stats:`, value: `**HP**: ${bossCurrentHP}/${boss.hp}\n`, inline: true};
        
            // randomly generate the move for the boss
            bossMove = boss.moves[functions.randomInteger(0,3)];
            bossMoveMsg = { name: 'Hint', value : `The ${boss.name} appears to be preparing to ${bossMove}`};

            bossFight = [userStats, bossStats, playerMoves, outcome, bossMoveMsg]
            // update the embed
            bossEmbed.spliceFields(0, 5, bossFight);
        })
        //If the user doesnt enter a valid response, monster attacks
        .catch(collected => {        
           
            playerCurrentHP -= 10;
            
            // print the outcome of the event. user didnt respond, boss got angry and attacked for 10hp
            outcome = { name: `Outcome`, value: `The bear got bored of waiting and attacked you anyway dealing 10 damage.`, inline: true };
            // update the user stats
            userStats = { name: `${message.author.username}'s Stats:`, value: `**HP**: ${playerCurrentHP}/${player.hp[1]}\n**Att**: ${player.attack}\n**Def**: ${player.defence}`, inline: true };
            // set the stats for the boss for the embed
            bossStats = { name: `Boss ${boss.name} ${boss.emoji} Stats:`, value: `**HP**: ${bossCurrentHP}/${boss.hp}\n`, inline: true};
            // randomly generate the move for the boss
            bossMove = boss.moves[functions.randomInteger(0,3)];
            bossMoveMsg = { name: 'Hint', value : `The ${boss.name} appears to be preparing to ${bossMove}`};

            bossFight = [userStats, bossStats, playerMoves, outcome, bossMoveMsg]
            // update the embed
            bossEmbed.spliceFields(0, 5, bossFight);
        });
    }

    // one the battle is over, see who the winner is
    // both player and boss die together
    if(playerCurrentHP <= 0 && bossCurrentHP <= 0){

        // set hp of boss and player to 0
        playerCurrentHP = 0;
        bossCurrentHP = 0;

        let drawMsg = {name: 'Outcome', value:`You and the ${boss.name} ${boss.emoji} have both manged to kill each other at the exact same time... Much to your amazement, a magical healing fairy is able to revive you so that you can walk back to base. \nGet some rest, heal up and attempt this boss battle again once you are ready.`};

        // update the user stats
        userStats = { name: `${message.author.username}'s Stats:`, value: `**HP**: ${playerCurrentHP}/${player.hp[1]}\n**Att**: ${player.attack}\n**Def**: ${player.defence}`, inline: true };
        // set the stats for the boss for the embed
        bossStats = { name: `Boss ${boss.name} ${boss.emoji} Stats:`, value: `**HP**: ${bossCurrentHP}/${boss.hp}\n`, inline: true};

        // prep the outcome embed
        const drawEmbed = new Discord.MessageEmbed()
        .setColor('#0A008C')
        .setTitle('It\'s a... draw!')
        .addFields(
            userStats,
            bossStats, 
            drawMsg    
        );

        // send the embed
        message.channel.send(drawEmbed);
        // update the database to set the users hp to 1
        let sql = `UPDATE Users SET hp = 1 WHERE id = '${message.author.id}'`;
        connection.query(sql);
        return;

    // boss kills player
    } else if (playerCurrentHP <= 0 && bossCurrentHP > 0) {

        // set hp of player to 0
        playerCurrentHP = 0;

        let defeatMsg = {name: 'Outcome', value: `The ${boss.name} ${boss.emoji} has managed to kill you. After sensing victory, the ${boss.name} decides to leave you laying there as he goes back to protect the area. After a while, magical healing fairy is able to revive you so that you can walk back to base.\nGet some rest, heal up and attempt this boss battle again once you are ready.`};

        // update the user stats
        userStats = { name: `${message.author.username}'s Stats:`, value: `**HP**: ${playerCurrentHP}/${player.hp[1]}\n**Att**: ${player.attack}\n**Def**: ${player.defence}`, inline: true };
        // set the stats for the boss for the embed
        bossStats = { name: `Boss ${boss.name} ${boss.emoji} Stats:`, value: `**HP**: ${bossCurrentHP}/${boss.hp}\n`, inline: true};

        // prep the outcome embed
        const defeatEmbed = new Discord.MessageEmbed()
        .setColor('#0A008C')
        .setTitle('Defeat.')
        .addFields(
            userStats,
            bossStats, 
            defeatMsg    
        );
        
        // send the embed
        message.channel.send(defeatEmbed);
        // update the database to set the users hp to 1
        let sql = `UPDATE Users SET hp = 1 WHERE id = '${message.author.id}'`;
        connection.query(sql);
        return;

    } else if (playerCurrentHP > 0 && bossCurrentHP <= 0){

        // set hp of boss to 0
        bossCurrentHP = 0;

        let victoryMsg = {name: 'Outcome', value: `You have managed to slay the ${boss.name} ${boss.emoji}, the path to the next area is now open. Upon entering the unknown of the new area, a sense of danger is in the air... You then realize that there will be new monsters to fight, and a new boss to defeat.`};
        let welcome = {name: 'Welcome', value: `Welcome to area 1, the 'official' first area of the game. Monsters can now kill you in battle, causing you to lose your progress towards the current level.\nYou have developed the skills to now use some tools. Use \`adv chop\` to gather wood based resources and \`adv mine\` to gather rock based resources.
        \nNew recipes will be possible with these new items.
        \nYou can now view and level up various skills with \`adv skills\`. 
        \nUse \`adv help\` for help
        \n**Goodluck, and enjoy your adventure throughout Erovar!**`};

        // update the user stats
        userStats = { name: `${message.author.username}'s Stats:`, value: `**HP**: ${playerCurrentHP}/${player.hp[1]}\n**Att**: ${player.attack}\n**Def**: ${player.defence}`, inline: true };
        // set the stats for the boss for the embed
        bossStats = { name: `Boss ${boss.name} ${boss.emoji} Stats:`, value: `**HP**: ${bossCurrentHP}/${boss.hp}\n`, inline: true};

        // prep the outcome embed
        const victoryEmbed = new Discord.MessageEmbed()
        .setColor('#0A008C')
        .setTitle('Victory!')
        .addFields(
            userStats,
            bossStats, 
            victoryMsg,
            welcome    
        );
        
        // send the embed
        message.channel.send(victoryEmbed);
        // update the database to set the users hp to their current hp, set their area to 1 and max area to 1
        let sql = `UPDATE Users SET hp = ${playerCurrentHP}, max_area = 1, area = 1 WHERE id = '${message.author.id}'`;
        connection.query(sql);
        return;

    }


}

async function damageTestBoss(player, message, area){

    if(area == 1){
        //Declare prompt message for boss
        var promtMessage = `Welcome to the second boss in Erovar.\n Upon defeating the boss, you will be granted access to area 2.`;

        // store boss into variable for easier access
        var boss;
        for(b in MONSTERS['area1']['boss']){
            boss = MONSTERS['area1']['boss'][b];        
        }

        //Create players move options
        var playerMoves = [];
        playerMoves.push(new playerMoveClass("Stab", 0, 1));
        playerMoves.push(new playerMoveClass("Slash", 20, 1.5));
        playerMoves.push(new playerMoveClass("Barrage Power", 50, 2));
        playerMoves.push(new playerMoveClass("Omni Bane", 85, 4));

        // update the user moves
        embedPlayerMoves = { name: `${player[0].username} Turn:`, value: 'What are you going to do?\n\`Stab\` 100% Attack \xa0\xa0\xa0|\xa0\xa0\xa0 100% Chance\n\`Slash\` 150% Attack \xa0\xa0\xa0|\xa0\xa0\xa0 80% Chance\n\`Barrage Power\` 200% Attack \xa0\xa0\xa0|\xa0\xa0\xa0 50% Chance\n\`Omni Bane\` 400% Attack \xa0\xa0\xa0|\xa0\xa0\xa0 15% Chance'};

    } else if(area == 2){
        //Declare prompt message for boss
        var promtMessage = `Welcome to the third boss in Erovar.\n Upon defeating the boss, you will be granted access to area 3.`;

        // store boss into variable for easier access
        var boss;
        for(b in MONSTERS['area2']['boss']){
            boss = MONSTERS['area2']['boss'][b];        
        }

        //Create players move options
        var playerMoves = [];
        playerMoves.push(new playerMoveClass("Willow Clap", 0, 1));
        playerMoves.push(new playerMoveClass("Earth Knock", 20, 1.5));
        playerMoves.push(new playerMoveClass("Serpent Volley", 50, 2));
        playerMoves.push(new playerMoveClass("Dodge", 50, 1.5));

        // update the user moves
        embedPlayerMoves = { name: `${player[0].username} Turn:`, value: 'What are you going to do?\n\`Willow Clap\` 100% Attack \xa0\xa0\xa0|\xa0\xa0\xa0 100% Chance\n\`Earth Knock\` 150% Attack \xa0\xa0\xa0|\xa0\xa0\xa0 80% Chance\n\`Serpent Volley\` 200% Attack \xa0\xa0\xa0|\xa0\xa0\xa0 50% Chance\n\`Dodge\` 150% Attack \xa0\xa0\xa0|\xa0\xa0\xa0 50% Chance'};
    }

    // if the player is prepared, prompt user if they are ready to start the boss fight
    // create the embed to send
    const ready = new Discord.MessageEmbed()
    .setColor('#0A008C')
    .setTitle('Boss Fight')
    .addFields(
        { name: `Description`, value: promtMessage},
        { name: "Ready", value: `If you are ready, type \`yes\` to begin the fight. If you need more time to prepare, type \`no\` to cancel.`}
    );

    //Generate an array of all the players id's
    var playerIDS = [];
    for(i = 0; i < player.length; i++){
        playerIDS.push(player[i].id)
    }

    message.channel.send(ready);

    var fightBoss = true;

    //Check if all players are ready to fight the boss
    while(playerIDS.length > 0 && fightBoss){
        var filter = m => playerIDS.includes(m.author.id) && (m.content.toLowerCase() == 'yes' || m.content.toLowerCase() == 'no');
        await message.channel.awaitMessages(filter, {max: 1, time: 30000, errors: ['time'] }).then(mes => {
            var command = mes.first().content.toLowerCase();
            if (command == 'no') {
                message.channel.send("Boss fight canceled");
                fightBoss = false;
                return;
            } else {
                    playerIDS = playerIDS.filter(e => e !== mes.first().author.id);
            }
            
        })
        .catch(collected => {
            message.channel.send(`Boss fight canceled. Not all people responded.`);
            fightBoss = false;
        });
    }

    if(!fightBoss)
        return;

    for(i = 0; i < player.length; i++){
        // update the cooldown in database
        var sql2 = `UPDATE Cooldown SET cd_boss = NOW() WHERE id = '${player[i].id}'`;
        connection.query(sql2);
    }
    
    damageTestBossFight(message, player, boss, playerMoves, embedPlayerMoves, area);
}


async function damageTestBossFight(message, player, boss, playerMoves, embedPlayerMoves, area){
    //Declare variable for number of players in fight
    var numberOfPlayers = player.length;

    //Define array to store people that die durring fight
    var deadPlayers = [];

    // create the embed to send
    const bossEmbed = new Discord.MessageEmbed()
    .setColor('#0A008C')
    .setTitle('Boss Fight')

    //Declare variable to track current HP for monster
    var bossCurrentHP = boss.hp * player.length;

    //Declare variable for tracking current players turn
    var currentPlayer = 0;

    hitMiss = undefined;

    while(player.length > 0 && bossCurrentHP > 0) {
        // set up listening for response
        let filter = m => m.author.id === player[currentPlayer].id && (m.content.toLowerCase() == playerMoves[0].mName.toLowerCase() || m.content.toLowerCase() == playerMoves[1].mName.toLowerCase() || m.content.toLowerCase() == playerMoves[2].mName.toLowerCase() || m.content.toLowerCase() == playerMoves[3].mName.toLowerCase());
        
        // update the user stats
        userStats = { name: `${player[currentPlayer].username}'s Stats:`, value: `**HP**: ${player[currentPlayer].hp[0]}/${player[currentPlayer].hp[1]}\n**Att**: ${player[currentPlayer].attack}\n**Def**: ${player[currentPlayer].defence}`, inline: true };

        // set the stats for the boss for the embed
        bossStats = { name: `Boss ${boss.name} ${boss.emoji} Stats:`, value: `**HP**: ${bossCurrentHP}/${boss.hp * numberOfPlayers}\n`, inline: true};

        //Set array of all embed messages. If this is the first embed, hitMiss will not be defined yet, so exlcude that
        if(typeof hitMiss != "undefined")
            bossFight = [hitMiss, userStats, bossStats, embedPlayerMoves];
        else
            bossFight = [userStats, bossStats, embedPlayerMoves]

        //Add new fields to embed
        bossEmbed.spliceFields(0, bossFight.length, bossFight);

        //Send Boss embed
        message.channel.send(bossEmbed)

        //Get users response
        await message.channel.awaitMessages(filter, {max: 1, time: 30000, errors: ['time'] }).then(mes => {
            // get the attack choice from user
            attack = mes.first().content.toLowerCase();

            //Variable used for tracking players lost hp
            var tempHP = [player[currentPlayer].hp[0], bossCurrentHP];

            //Players move converted to index
            var playersMove;

            //Get the hit percent chance and hit damage percent based on players move
            if(attack == playerMoves[0].mName.toLowerCase())
                playersMove = 0;
            else if(attack == playerMoves[1].mName.toLowerCase())
                playersMove = 1;
            else if(attack == playerMoves[2].mName.toLowerCase())
                playersMove = 2;
            else if(attack == playerMoves[3].mName.toLowerCase())
                playersMove = 3;

            //Check if player hit boss
            if(functions.randomInteger(1, 100) > playerMoves[playersMove].chance){
                if(playerMoves[playersMove].mName != "Dodge"){
                    //Calculate damage done to player
                    player[currentPlayer].playerHit(functions.calculateDamage(boss.attack, player[currentPlayer].defence, player[currentPlayer].hp[0], 1));

                    //Player died, add message that the player died
                    if(player[currentPlayer].hp[0] < 1)
                        deathMessage = "You have died!";
                    else
                        deathMessage = "";
                }
                bossCurrentHP = functions.calculateDamage(player[currentPlayer].attack, boss.defence, bossCurrentHP, playerMoves[playersMove].damage);
                hitMiss = { name: `${player[currentPlayer].username}'s Attack`, value: `You hit ${boss.name} ${boss.emoji} for ${tempHP[1] - bossCurrentHP} HP :hearts:\nYou were hit for ${tempHP[0] - player[currentPlayer].hp[0]} HP :hearts: ${deathMessage}`};
            } else {
                //Calculate damage done to player
                player[currentPlayer].playerHit(functions.calculateDamage(boss.attack, player[currentPlayer].defence, player[currentPlayer].hp[0], 1));

                //Player died, add message that the player died
                if(player[currentPlayer].hp[0] < 1)
                    deathMessage = "You have died!";
                else
                    deathMessage = "";

                hitMiss = { name: `${player[currentPlayer].username}'s Attack`, value: `You missed!\nYou were hit for ${tempHP[0] - player[currentPlayer].hp[0]} HP :hearts: ${deathMessage}`};
            }

            //Player died, add message that the player died
            if(player[currentPlayer].hp[0] < 1){
                deadPlayers.push(player[currentPlayer]);
                //If the player is dead, remove them from player array
                player.splice(currentPlayer, 1);
            } else{
                //Increment to next player
                currentPlayer++;
            }
            
        })
        .catch(collected => {
            var tempHP = [player[currentPlayer].hp[0], bossCurrentHP];
            //Calculate damage done to player
            player[currentPlayer].playerHit(functions.calculateDamage(boss.attack, player[currentPlayer].defence, player[currentPlayer].hp[0], 1));

            //Player died, add message that the player died
            if(player[currentPlayer].hp[0] < 1)
                deathMessage = "You have died!";
            else
                deathMessage = "";

            hitMiss = { name: `${player[currentPlayer].username}'s Attack`, value: `You took too long. The ${boss.name} hit you while you were thinking!\nYou were hit for ${tempHP[0] - player[currentPlayer].hp[0]} HP :hearts: ${deathMessage}`};


            //Player died, add message that the player died
            if(player[currentPlayer].hp[0] < 1){
                deadPlayers.push(player[currentPlayer]);
                //If the player is dead, remove them from player array
                player.splice(currentPlayer, 1);
            } else{
                //Increment to next player
                currentPlayer++;
            }
        });

        //If at the end of the player array, reset back to zero
        if(currentPlayer >= player.length)
            currentPlayer = 0;

    }
    //  The battle is over, see who the winner is
    // both players and boss die together
    if(player.length < 1 && bossCurrentHP <= 0){

        // set hp of boss to 0
        bossCurrentHP = 0;

        let drawMsg = {name: 'Outcome', value:`Your party and the ${boss.name} ${boss.emoji} have both manged to kill each other at the exact same time... \nGet some rest, heal up and attempt this boss battle again once you are ready.`};

        // set the stats for the boss for the embed
        bossStats = { name: `Boss ${boss.name} ${boss.emoji} Stats:`, value: `**HP**: ${bossCurrentHP}/${boss.hp * numberOfPlayers}\n`, inline: true};

        // prep the outcome embed
        const drawEmbed = new Discord.MessageEmbed()
        .setColor('#0A008C')
        .setTitle('It\'s a... draw!')
        .addFields(
            bossStats, 
            drawMsg    
        );

        // send the embed
        message.channel.send(drawEmbed);
        // update the database to set the users hp to 1
        for(i = 0; i < deadPlayers.length; i++){
            let sql = `UPDATE Users SET hp = 1 WHERE id = '${deadPlayers[i].id}'`;
            connection.query(sql);
        }
        return;

    // boss kills player
    } else if (player.length < 1 && bossCurrentHP > 0) {

        let defeatMsg = {name: 'Outcome', value: `The ${boss.name} ${boss.emoji} has managed to kill your entire party.\nGet some rest, heal up and attempt this boss battle again once you are ready.`};

        // set the stats for the boss for the embed
        bossStats = { name: `Boss ${boss.name} ${boss.emoji} Stats:`, value: `**HP**: ${bossCurrentHP}/${boss.hp * numberOfPlayers}\n`, inline: true};

        // prep the outcome embed
        const defeatEmbed = new Discord.MessageEmbed()
        .setColor('#0A008C')
        .setTitle('Defeat.')
        .addFields(
            bossStats, 
            defeatMsg    
        );
        
        // send the embed
        message.channel.send(defeatEmbed);
        // update the database to set the users hp to 1
        for(i = 0; i < deadPlayers.length; i++){
            let sql = `UPDATE Users SET hp = 1 WHERE id = '${deadPlayers[i].id}'`;
            
            connection.query(sql);
        }
        
        return;

    } else if (player.length > 0 && bossCurrentHP <= 0){

        // set hp of boss to 0
        bossCurrentHP = 0;

        let victoryMsg = {name: 'Outcome', value: `You have managed to slay the ${boss.name} ${boss.emoji}, the path to the next area is now open. Upon entering the unknown of the new area, a sense of danger is in the air... You then realize that there will be new monsters to fight, and a new boss to defeat.`};
        let welcome = {name: 'Welcome', value: `Welcome to area ${area}!
        \nUse \`adv help\` for to see any new commands availble
        \n**Goodluck, and enjoy your adventure throughout Erovar!**`};

        // set the stats for the boss for the embed
        bossStats = { name: `Boss ${boss.name} ${boss.emoji} Stats:`, value: `**HP**: ${bossCurrentHP}/${boss.hp * numberOfPlayers}\n`, inline: true};

        // prep the outcome embed
        const victoryEmbed = new Discord.MessageEmbed()
        .setColor('#0A008C')
        .setTitle('Victory!')
        .addFields(
            bossStats, 
            victoryMsg,
            welcome    
        );
        
        // send the embed
        message.channel.send(victoryEmbed);
        // update the database to set the users hp to their current hp, set their area to 1 and max area to 1
        for(i = 0; i < player.length; i++){
            let sql = `UPDATE Users SET hp = ${player[i].hp[0]}, max_area = ${area + 1}, area = ${area + 1} WHERE id = '${player[i].id}'`;
            connection.query(sql);
        }
        for(i = 0; i < deadPlayers.length; i++){
            let sql = `UPDATE Users SET hp = 1, max_area = ${area + 1}, area = ${area + 1} WHERE id = '${deadPlayers[i].id}'`;
            connection.query(sql);
        }
    
        return;

    }
}