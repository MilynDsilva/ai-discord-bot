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
  },
  {
    name: 'ask',
    description: 'Ask something',
    options: [
      {
        name: 'question',
        description: 'Your question',
        type: 3, // 3 corresponds to STRING type for Discord slash commands
        required: true,
      },
    ],
  },
  {
    name: 'translate',
    description: 'Translate something to russian',
    options: [
      {
        name: 'text',
        description: 'Your text',
        type: 3, // 3 corresponds to STRING type for Discord slash commands
        required: true,
      },
    ],
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