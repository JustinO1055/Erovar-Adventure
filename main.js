const Discord = require('discord.js');
const login = require('./login.json');

// setting up the client for the bot to connect to discord
const client = new Discord.Client();
global.client = client;

// setting a value for the prefix for the bot to look for at the start of a message
const regExPrefix = /^[a][d][v] /i;

// cooldown code. Helps to prevent users from spamming, 1 second cooldown between commands sent
let cooldown = new Set();
let cooldownS = 1;

// set up searching for commands in seperate files
const fs = require('fs');
client.commands = new Discord.Collection();

// read all the files 
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for(const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

// connect to the database
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : login.host,
  user     : login.user,
  password : login.password,
  database : login.database
});

// if there is an error, print error to console else print conntected
connection.connect(err =>{
    if(err) throw err;
    console.log("connected");
    global.connection = connection;
}); 

// once the client is ready, print the online message
client.once('ready', () => {
    console.log('Online');
});

//when a message is sent in the chat, check the message
client.on('message', message => {

    // if the message matches the set prefix (adv ) and passes the regex, execute the given command
    if(regExPrefix.test(message.content)){

        // split the message by removing the prefix, split the words by using the delimiter " ", turn all arguments to lower case
        const args = message.content.substring(4).split(/ +/).map(a => a.toLowerCase());
        const command = args.shift();

        // if user is on cooldown, Print a message and return.
        // do not execute their command
        if(cooldown.has(message.author.id)){
            return message.reply("You must wait 1 second between commands. Please Stop Spamming");
        }

        // preform SQL query to see if user exists
        let sql = `SELECT admin FROM Users WHERE id = '${message.author.id}'`;
        // query the database
        connection.query(sql, (err, rows) =>{

            // Check to see if the user has already started the bot
            // if account does not exist...
            if(rows.length < 1){
                //if command is start, create their user within the bot
                if(command === 'start'){
                    client.commands.get('start').execute(message, args);
                // otherwise prompt them to start
                } else {
                    message.reply("Please use **adv start** to begin your journey into Erovar!");
                }
            // otherwise the user has alreay began
            // execute their command
            } else {

                // allow for admin only commands to be run
                if(rows[0].admin == 1){
                    if (command === 'ping'){
                        // execture the command in the file ping.js
                        client.commands.get('ping').execute(message, args);
                    }
                }
                //add a cooldown to the author of the message.
                cooldown.add(message.author.id);

                // if else conditions for each commanc, if command matches, execute the command in the given file
                if (command === 'start'){
                    // execute the command in the file start.js
                    client.commands.get('start').execute(message, args);
		        }else if (command === 'find'){
                    // execute the command in the file find.js
                    client.commands.get('find').execute(message, args);
		        }else if (command === 'inventory' || command === 'i'){
                    // execute the command in the file inventory.js
                    client.commands.get('inventory').execute(message, args);
		        }else if (command === 'craft'){
                    // execute the command in the file craft.js
                    client.commands.get('craft').execute(message, args);
		        }else if (command === 'recipes'){
                    // execute the command in the file recipes.js
                    client.commands.get('recipes').execute(message, args);
		        }else if (command === 'profile' || command === 'p'){
                    // execute the command in the file profile.js
                    client.commands.get('profile').execute(message, args);
		        }else if (command === 'sell'){
                    // execute the command in the file sell.js
                    client.commands.get('sell').execute(message, args);
		        }else if (command === 'area'){
                    // execute the command in the file area.js
                    client.commands.get('area').execute(message, args);
		        }else if (command === 'cooldown' || command === 'cd'){
                    // execute the command in the file cooldown.js
                    client.commands.get('cooldown').execute(message, args);
		        }else if (command === 'ready' || command === 'rd'){
                // execute the command in the file ready.js
                    client.commands.get('ready').execute(message, args);
                } else if (command === 'disassemble' || command === 'diss' || command === 'da'){
                    // execute the command in the file disassemble.js
                    client.commands.get('disassemble').execute(message, args);
                } else if (command === 'help' || command === 'h'){
                    // execute the command in the file help.js
                    client.commands.get('help').execute(message, args);
                }  else if (command === 'battle'){
                    // execute the command in the file battle.js
                    client.commands.get('battle').execute(message, args);
                }  else if (command === 'sleep'){
                    // execute the command in the file sleep.js
                    client.commands.get('sleep').execute(message, args);
                }  else if (command === 'heal'){
                    // execute the command in the file heal.js
                    client.commands.get('heal').execute(message, args);
                }  else if (command === 'shop'){
                    // execute the command in the file shop.js
                    client.commands.get('shop').execute(message, args);
                }  else if (command === 'buy'){
                    // execute the command in the file buy.js
                    client.commands.get('buy').execute(message, args);
                }
            }
        });

    }

    // timeout command for clearing cooldowns
    setTimeout(() =>{
        cooldown.delete(message.author.id)
    }, cooldownS * 1000);

});

// allows the bot to log in. Token is gathered from login.json
// token is essentially the password so is kept private
client.login(login.token);
