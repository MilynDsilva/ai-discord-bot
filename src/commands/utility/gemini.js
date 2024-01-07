const { SlashCommandBuilder } = require('discord.js');
const logger = require('../../../logger/logger');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gemini')
        .setDescription('Ask google gemini something.').addStringOption(option =>
            option.setName('text')
                .setDescription('Input text')
                .setRequired(true)),

    async execute(interaction) {
        await interaction.deferReply();
        const clientMessage = interaction.options.getString('text') || null;

        let response = '';
        const options = {
            method: 'POST',
            url: process.env.RAPID_API_GEMINI_URL,
            headers: {
                'content-type': 'application/json',
                'X-RapidAPI-Key': process.env.RAPID_API_KEY,
                'X-RapidAPI-Host': process.env.RAPID_API_GEMINI_HOST
            },
            data: {
                contents: [
                    {
                        role: 'user',
                        parts: [
                            {
                                text: clientMessage
                            }
                        ]
                    }
                ]
            }
        };

        try {
            const result = await axios.request(options);
            response = result.data.candidates[0].content.parts[0].text
        } catch (error) {
            response = error.response.data.message
            console.error(error);
        }

        await interaction.editReply(`***Prompt:*** ${clientMessage}\n***Response:*** ${response}`);

    },
};