const logger = require('../logger/logger');
require('dotenv').config();
const { REST, Routes } = require('discord.js');

const commands = [
  {
    name: 'ping',
    description: 'Replies with Pong!',
  },
  {
    name: 'server',
    description: 'Provides information about the server.',
  },
  {
    name: 'user',
    description: 'Provides information about the user.'
  }
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN);

(async () => {
  try {
    logger.info('Registering slash commands...');

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: commands }
    );

    logger.info('Slash commands were registered successfully!');
  } catch (error) {
    logger.error(`There was an error: ${error}`);
  }
})();