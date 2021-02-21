const Discord = require('discord.js');

// include the json file that holds all of the items names and emoji codes
const {items} = require('../jsons/items.json');

// include functions file
var functions = require('../functions.js');

module.exports={
    name: 'help',
    description: "Give user help",
    execute(message, args){

        if(args[0] == "" || args[0] == null){
            
            //Create the embed to output
            var helpEmbed = new Discord.MessageEmbed()
                .setTitle(`<:ErovarAdventure:810276183202856990> Help`)
                .setDescription(`Start all commands with \`adv\` in order for it to work.\nFor more information on any command or item, use \`adv help <command | item>\``)
                .setColor('#FF69B4')
                .addFields(
                    { name: `General Commands`, value: `\`area\` | \`cooldown\` | \`heal\` | \`help\` | \`inventory\` | \`ready\` | \`profile\` | \`skills\` | \`sleep\``},
                    { name: `Combat Commands`, value: `\`battle\` | \`boss\` | \`expedition\` | \`heal\` | \`sleep\``},
                    { name: `Shop Commands`, value: `\`buy\` | \`use\` | \`sell\` | \`shop\``},
                    { name: `Artisan & Gathering Commands`, value: `\`chop\` | \`craft\` | \`disassemble\` | \`mine\` | \`inventory\` | \`recipes\``}
                );

                // later will need to update this with the commands we add in higher areas

            //Send Embed
            message.channel.send(helpEmbed);
            return;
        }

        // store the modifer for commands
        let modifer = args[1];

        //Parse argument list
        var arguments = functions.parseArguments(args);
        itemSearch = arguments[0];
        
        // loop through items json to find it
        for(i in items){
            if(i === itemSearch){
                //Create the embed to output
                var helpEmbed = new Discord.MessageEmbed()
                .addFields(
                    { name: `${items[i]['name']}  ${items[i]['emoji']}`, value: items[i]['description']},
                    { name: `Sell Value`, value: items[i]['value']},
                );
                
                // if the second arg is sword shield or armor, add new field for stats
                if(arguments[2] == 'sword' || arguments[2] == 'shield' || arguments[2] == 'armor'){
                    helpEmbed.addFields({name: 'Stats', value: `Attack :crossed_swords:: ${items[i]['attack']}, Defence :shield:: ${items[i]['defence']}`});
                }

                helpEmbed 
                .setColor('#FF69B4')
                .setFooter(`Use "adv help" for general help`);

                message.channel.send(helpEmbed);
                return;

            }
        } 

        //Help pages for all commands within the bot
        switch(args[0]){
            case 'area':
                //Create the embed to output
                var helpEmbed = new Discord.MessageEmbed()
                    .addFields(
                        { name: `Area`, value: `Used to move to another area. Usually used if enemies are too strong in your current area or you need to get resources from a specific area.\nNew areas are unlocked by beating the boss in an area.`},
                        { name: `Usage:`, value: `\`adv area <# of area>\``}
                    );
    
                break;
            case 'battle':
                //Create the embed to output
                var helpEmbed = new Discord.MessageEmbed()
                    .addFields(
                        { name: `Battle`, value: `A simple fight to train yourself in the ways of combat and get some gold. It is recommended that you bring a weapon and armor, or you may not make it back alive.\n
                            Once you find a target, you will see its HP, attack and defense and then you can choose to fight it or run away.\n
                            Attempting to run away won't guarantee that will you get away uninjured.\n
                            Damage done will be relative to the difference between attack and defense. There is some element of randomness to the damage dealt, but you should be able to determine whether you can beat the monster or not.\n
                            The fight will only last one turn, so unless you beat the monster in one hit, you will not be able to get a reward.\n
                            Note: You can use the aurgument skip to skip the decision and automatically fight the enemy.`},
                        { name: `Usage:`, value: `\`adv battle\` | \`adv battle skip\``}
                    );
    
                break;
            case 'boss':
                if(modifer == 0){
                    var helpEmbed = new Discord.MessageEmbed()
                        .addFields(
                            { name: `Boss`, value: `Once you have prepared enough, use this to challenge the boss of the area so you can progress to the next area.\n
                                This is a completely strategic fight, so experiment and learn what moves to use to counter the monster.`},
                            { name: `Requirements`, value: `Level 3\nBasic Sword ${functions.getEmoji('basic_sword')}\nBasic Shield ${functions.getEmoji('basic_shield')}\nStone axe ${functions.getEmoji('stone_axe')}\nStone Pickaxe ${functions.getEmoji('stone_pickaxe')}\n`},
                            { name: `Tips`, value: `This boss has a 'tell' that hints to what the boss is going to do. Each move has 1 good counter, 1 okay counter, and 2 bad counters. You will have to figure out what is good against each move in order to defeat this boss`},
                            { name: `Usage:`, value: `\`adv boss\``}
                        );
                // if generic boss help print generic message
                } else {
                //Create the embed to output
                    var helpEmbed = new Discord.MessageEmbed()
                        .addFields(
                            { name: `Boss`, value: `Once you have prepared enough, use this to challenge the boss of the area so you can progress to the next area.\n
                                This is a completely strategic fight, so experiment and learn what moves to use to counter the monster.`},
                            { name: `Usage:`, value: `\`adv boss\``}
                        );
                } 
    
                break;
            case 'buy':
                //Create the embed to output
                var helpEmbed = new Discord.MessageEmbed()
                    .addFields(
                        { name: `Buy`, value: `Used to buy basic items from the shop. Use \`adv shop\` to see the available stock.`},
                        { name: `Usage:`, value: `\`adv buy <items> [amount]\``}
                    );
    
                break;
            case 'chop':
            //Create the embed to output
            var helpEmbed = new Discord.MessageEmbed()
                .addFields(
                    { name: `Chop`, value: `Unlocked in area 1. Use this to get various logs and materials to craft new equipment.`},
                    { name: `Possible Items:`, value: `${items['stick']['emoji']} ${items['log']['emoji']} ${items['pine_log']['emoji']}`},
                    { name: `Usage:`, value: `\`adv chop\``}
                );

            break;
            case 'cooldown':
            case 'cd':
                //Create the embed to output
                var helpEmbed = new Discord.MessageEmbed()
                    .addFields(
                        { name: `Cooldown`, value: `Used to see the cooldowns of all your commands.`},
                        { name: `Usage:`, value: `\`adv cooldown\``},
                        { name: `Alias`, value:  `\`cooldown\` \`cd\``}
                    );
    
                break;
            case 'craft':
                //Create the embed to output
                var helpEmbed = new Discord.MessageEmbed()
                    .addFields(
                        { name: `Craft`, value: `Used to craft items and equipment. Use the \`recipes\` command to see the list of recipes that can be crafted.\nNote that you cannot carry more than one item of the same equipment type. For example, you can only have one sword and one armor at once, so you have to sell your current one to craft another.`},
                        { name: `Usage:`, value: `\`adv craft <item name> [# to craft]\``}
                    );

                break;
            case 'disassemble':
            case 'dis':
            case 'da':
                //Create the embed to output
                var helpEmbed = new Discord.MessageEmbed()
                    .addFields(
                        { name: `Disassemble`, value: `Used to disassemble an item to get its components back. This will only give back 50% of the recipe cost.`},
                        { name: `Usage:`, value: `\`adv disassemble <item name> [# to disassemble]\``},
                        { name: `Alias`, value:  `\`disassemble\` \`dis\` \`da\``}
                    );
    
                break;
            case 'expedition':
            case 'exp':
                //Create the embed to output
                var helpEmbed = new Discord.MessageEmbed()
                    .addFields(
                        { name: `Expedition`, value: `You explore to find a bigger monster to put your skills to a test.\n
                            Once in combat, you will be able to have an educated guess at what the monster will use to attack, use this information to help figure out the best action to take.\n
                            Damage will be calculated in a very similar way to battle. However, depending on what what you and the monster use will greatly affect the damage dealt.
                            This fight will continue until you or the monster is defeated. So make sure you are ready.`},
                        { name: `Usage:`, value: `\`adv expedition\``},
                        { name: `Alias`, value:  `\`expedition\` \`exp\` `}
                    );
    
                break;
            case 'find':
                //Create the embed to output
                var helpEmbed = new Discord.MessageEmbed()
                    .addFields(
                        { name: `Find`, value: `Used in area 0 to find tha materials to get your first set of equipment.`},
                        { name: `Possible Items:`, value: `${items['stick']['emoji']} ${items['log']['emoji']} ${items['pebble']['emoji']} ${items['stone']['emoji']}`},
                        { name: `Usage:`, value: `\`adv find\``}
                    );

                break;
            case 'give':
                //Create the embed to output
                var helpEmbed = new Discord.MessageEmbed()
                    .addFields(
                        { name: `Give`, value: `Used to give another player gold or items.`},
                        { name: `Usage:`, value: `\`adv give <@player> <item name | gold> [amount]\``}
                    );

                break;
            case 'heal':
                //Create the embed to output
                var helpEmbed = new Discord.MessageEmbed()
                    .addFields(
                        { name: `Heal`, value: `Uses a potion from your inventory to heal yourself.`},
                        { name: `Usage:`, value: `\`adv heal\``}
                    );
    
                break;
            case 'inventory':
            case 'i':
                //Create the embed to output
                var helpEmbed = new Discord.MessageEmbed()
                    .addFields(
                        { name: `Inventory`, value: `Used to see a player's inventory.`},
                        { name: `Usage:`, value: `\`adv inventory [player]\``},
                        { name: `Alias`, value:  `\`inventory\` \`i\` `}
                    );
    
                break;
            case 'mine':
                //Create the embed to output
                var helpEmbed = new Discord.MessageEmbed()
                    .addFields(
                        { name: `Mine`, value: `Unlocked in area 1. Use this to get various ores and materials to craft new equipment.`},
                        { name: `Possible Items:`, value: `${items['pebble']['emoji']} ${items['stone']['emoji']} ${items['copper_ore']['emoji']}`},
                        { name: `Usage:`, value: `\`adv mine\``}
                    );
    
                break;
            case 'profile':
            case 'p':
                //Create the embed to output
                var helpEmbed = new Discord.MessageEmbed()
                    .addFields(
                        { name: `Profile`, value: `Used to see a player's profile.`},
                        { name: `Usage:`, value: `\`adv profile [player]\``},
                        { name: `Alias`, value:  `\`profile\` \`p\` `}
                    );
    
                break;
            case 'ready':
            case 'rd':
                //Create the embed to output
                var helpEmbed = new Discord.MessageEmbed()
                    .addFields(
                        { name: `Ready`, value: `Used to see what commands a player has ready.`},
                        { name: `Usage:`, value: `\`adv ready [player]\``},
                        { name: `Alias`, value:  `\`ready\` \`rd\` `}
                    );
    
                break;
            case 'recipes':
                //Create the embed to output
                var helpEmbed = new Discord.MessageEmbed()
                    .addFields(
                        { name: `Recipes`, value: `Used to see what items can be crafted and the recipes for those items. \nRecipes are broken into several categories: \`equipment\` \`items\``},
                        { name: `Usage:`, value: `\`adv recipes <category>\``}
                    );
    
                break;
            case 'use':                
                //Create the embed to output
                var helpEmbed = new Discord.MessageEmbed()
                    .addFields(
                        { name: `Use`, value: `Used to use consumables that the player has. Can check consumables using \`adv inventory\`. For help on the consumable, use \`adv help <consumable\``},
                        { name: `Usage:`, value: `\`adv use <consumable>\``}
                );
                break;
            case 'sell':
                //Create the embed to output
                var helpEmbed = new Discord.MessageEmbed()
                    .addFields(
                        { name: `Sell`, value: `Used to sell items that are not needed or old equipment to craft newer equipment.`},
                        { name: `Usage:`, value: `\`adv sell <item> [amount]\``}
                    );
    
                break;
            case 'shop':
                //Create the embed to output
                var helpEmbed = new Discord.MessageEmbed()
                    .addFields(
                        { name: `Shop`, value: `Used to see what items can be bought from the shop.`},
                        { name: `Usage:`, value: `\`adv shop\``}
                    );
    
                break;
            case 'skills':
                //Create the embed to output
                var helpEmbed = new Discord.MessageEmbed()
                    .addFields(
                        { name: `Skill`, value: `Used to see a player's skill progression.`},
                        { name: `Usage:`, value: `\`adv skills [player]\``}
                    );
                break;
            case 'sleep':
                //Create the embed to output
                var helpEmbed = new Discord.MessageEmbed()
                    .addFields(
                        { name: `Sleep`, value: `Used to fully heal yourself every 18 hours.`},
                        { name: `Usage:`, value: `\`adv heal\``}
                    );
    
                break;
            default:
                var helpEmbed = new Discord.MessageEmbed()
                        .setDescription("Cannot find a help page for that.")
                

        }
        //Add last details to help embed
        helpEmbed
            .setColor('#FF69B4')
            .setFooter(`Use "adv help" for general help`)
            

        //Send Embed
        message.channel.send(helpEmbed);
        
    }
}