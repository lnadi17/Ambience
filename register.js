const {REST, Routes} = require('discord.js');
require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');

const commands = [];
// Grab all the command files from the commands directory you created earlier
const foldersPath = path.join(__dirname, 'dist/commands');
const commandFiles = fs.readdirSync(foldersPath).filter(file => file.endsWith('.js'));
console.log(commandFiles);

for (const com of commandFiles) {
    // Grab all the command files from the commands directory you created earlier
    // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
    const filePath = path.join(foldersPath, com);
    console.log(filePath)
    const command = require(filePath).default;
    if ('data' in command && 'execute' in command) {
        commands.push(command.data.toJSON());
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(process.env.TOKEN);

// and deploy your commands!
(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        // The put method is used to fully refresh all commands in the guild with the current set
        const data = await rest.put(
            // Routes.applicationGuildCommands(clientId, guildId),
            // { body: commands },
            Routes.applicationCommands(process.env.CLIENT_ID),
            {body: commands},
        );

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        // And of course, make sure you catch and log any errors!
        console.error(error);
    }
})();