const {version} = require('../package.json');

module.exports={
    name: 'version',
    description: "Outputs the current version of the bot",
    execute(message, args){
        message.channel.send(`Erovar Adventure is currently on **Version: ${version}**`);
    }
}