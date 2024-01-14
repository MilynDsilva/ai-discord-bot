const { SlashCommandBuilder } = require('discord.js');
const logger = require('../../../logger/logger');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('translate')
        .setDescription('Translates given input text.').addStringOption(option =>
            option.setName('text')
                .setDescription('Input text to translate')
                .setRequired(true)),

    async execute(interaction) {
        await interaction.deferReply();
        const clientMessage = interaction.options.getString('text') || null;

        let response = '';

        const options = {
            method: 'POST',
            url: process.env.RAPID_API_TRANSLATES_URL,
            headers: {
                'content-type': 'application/json',
                'X-RapidAPI-Key': process.env.RAPID_API_KEY,
                'X-RapidAPI-Host': process.env.RAPID_API_TRANSLATES_HOST
            },
            data: {
                texts: [
                    clientMessage,
                ],
                tls: ['kn', 'ru'],
                sl: 'en'
            }
        };

        try {
            const result = await axios.request(options);
            response = result.data[1]["texts"]
        } catch (error) {
            console.error(error);
        }

        await interaction.editReply(`***Text To Translate:*** ${clientMessage}\n***Tanslated Text:*** ${response}`);

    },
};