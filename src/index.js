// Discord.js versions ^13.0 require us to explicitly define client intents
const { Client, GatewayIntentBits, Collection, Events } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const logger = require('../logger/logger');
const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });
const path = require('path');
const fs = require('fs');
const keepAlive = require('../src/server/keep-alive')

client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        // Set a new item in the Collection with the key as the command name and the value as the exported module
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            logger.info(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

client.on('ready', () => {
    logger.info(`Logged in as ${client.user.tag}!`)
    client.user.setPresence({ activities: [{ name: 'Ludo with ChatGPT' }] });
});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        logger.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
        } else {
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
});



// Bot Log In
client.login(process.env.DISCORD_BOT_TOKEN);