const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const logger = require('../../../logger/logger');
const apiKey = process.env.OPEN_AI_API_KEY;
const API_ENDPOINT = process.env.OPEN_AI_API_URL;
const OPEN_AI_MODEL = 'gpt-3.5-turbo';
const { checkPermissions } = require('../../auth/permissions');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ask')
        .setDescription('Provides response from ChatGPT.').addStringOption(option =>
            option.setName('question')
                .setDescription('The question that you want answered')
                .setRequired(true)),

    async execute(interaction) {
        await interaction.deferReply();

        const hasPermission = await checkPermissions(interaction);
        
        if (!hasPermission) {
            return;
        }

        const clientMessage = interaction.options.getString('question') || null;

        let response = '';

        if (clientMessage !== null) {
            const promptText = clientMessage;

            try {
                const axios = require('axios');
                let data = JSON.stringify({
                    "model": OPEN_AI_MODEL,
                    "messages": [
                        {
                            "role": "user",
                            "content": promptText
                        }
                    ],
                    "temperature": 0.7
                });

                let config = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: API_ENDPOINT,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`
                    },
                    data: data
                };

                axios.request(config)
                    .then(async (result) => {
                        response = result.data.choices[0].message.content;
                        logger.info(response);
                        await interaction.editReply(`***Question:*** ${clientMessage}\n***Response:*** ${response}`);
                    })

            } catch (error) {
                logger.error(error);
                await interaction.editReply(`***Error***: Something went wrong, check the logs for info.`);
                return;
            }

        }
    },
};