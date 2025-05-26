require("dotenv").config();
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');

const commands = [
    {
        name: 'add',
        description: 'adds two number'
    },
    
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log("🚀 Registering slash commands...");

        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands }
        );

        console.log("✅ Finished registering slash commands!");
    } catch (error) {
        console.log(`❌ There was an error: ${error}`);
    }
})();
