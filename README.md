# Erovar Adventure - Text Based Discord RPG Bot
Erovar Adventure lets you expand what you do within Discord. Along with being able to talk with friends, this bot allows you to play a game within the same server that you would use to talk to friends. Erovar Adventure is a simple RPG game that includes combat, gathering materials, boss battles and much more. In this game you will progress your character through various areas fighting various enemies all in an attempt to defeat the final boss. 

Discord prefix: adv

This game was created for CS 476 final project.

Name(s): Justin Ottenbreit & Patrick LeBlanc

Student ID(s): 200251932 & 200374786

## Setup
In order to use this Discord bot, you can either invite the already hosted bot to your server of choosing, or you can download the source code, host the bot yourself and then invite it to the server fo your choosing.

### Invite Link
A user with admin permissions within a server can click on this link in order to invite this bot to the server.
[Erovar Adventure](https://discord.com/oauth2/authorize?client_id=797230767281405993&scope=bot&permissions=1544551543 "Invite Link")

### Build From Scratch
Preliminaries:
* Node.js installed ([Node.js](https://nodejs.org/en/download/ "Node.js Install"))
* MySQL or MariaDB server installed. ([MariaDB](https://mariadb.org/download/ "MariaDB Install"))
* Following Node Packages
    * discord.js
    * mariadb
    * mysql
* 70+ Discord Server Emoji Slots (Can be split across multiple Discord servers. The bot must be a member of each server.)

1. Clone the bot to your server by using ```git clone https://github.com/JustinO1055/Erovar-Adventure.git```
2. Go to the Discord Developer Portal Page [here](https://discord.com/developers/applications "Discord Developer Portal") and sign into your account.
3. Click "New Application" in the top right corner.
4. Give the bot a name. IE "Adventure Time"
5. On the left hand side selection panel, click on Bot.
6. On the bot page, click "Add Bot" and then "Yes, do it"
7. Here you can give the bot a unique Username and profile photo. Additonally, you can set the bot to be public or private. 
8. Next you can invite the bot to your server with permissions being granted. To do so, go to [here](https://discordapi.com/permissions.html#1544551543 "Discord Permission Calculator") in order to create an invite link for the bot with the nessecary permissions. Once on this page, you will ensure that the correct permissions are set (should be done automatically to match the photo below), then from the General Information page on the Discord Developer Portal, you will copy the Client ID into the permissions calculator to then generate the link. Clicking on this link will allow you to add this bot into the server.
9. Once added, you will then need to copy the `login.json.copy` to `login.json` and update the `login.json file`. The token is found on the Bot page on the Discord Developer Portal, you will copy this token into this file. (**NOTE: KEEP THIS TOKEN PRIVATE AS IT WILL ALLOW OTHERS TO ALSO LOG INTO THE BOT TO USE IT.**). Following this, you will put the hostname for the server where MariaDB or MySql is located, the user for the database, the user's password and the database name to allow the bot to connect to the database. 
10. Once your database has been selected and you are in the base directory for the project, you will need to create all the required tables. Run `source SQL.sql` to create all these tables. You can verify that all the tables match with the SQL file.
11. All assets within the `assets` directory need to be added to the host servers. (Can be split across multiple servers, the bot needs to be a member to access them).
12. Need to update the emoji code values in `jsons/items.json`, `jsons/monsters.json` and `jsons/learn.json`.
    1. To update these, you will need to find the new code for each emoji. To find the code, within discord type `\:\[emojiname\]:` and it will give a value similar to `<:ErovarAdventure:810276183202856990>`. This is the code for the emoji.
    2. Change the old emoji code to the new one that you just obtained.
    3. Repeat these steps for all items, monsters and questions within the given json files.
13. You will then have the install all of the dependancies required for this bot to run. To do this you will run ```sudo npm install``` and it will install all of the required dependancies.
14. You can now run the bot by running ```node .``` within the bots main directory. Alternatively, you can use a process manager such as [PM2](https://pm2.keymetrics.io/ "PM2") in order to manage the process to allow it to run constantly.
