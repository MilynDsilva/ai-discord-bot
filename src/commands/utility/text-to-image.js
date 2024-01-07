const { SlashCommandBuilder } = require('discord.js');
const logger = require('../../../logger/logger');
const axios = require('axios');
const provider = 'stabilityai';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('image')
        .setDescription('Generate some image.').addStringOption(option =>
            option.setName('text')
                .setDescription('Input text')
                .setRequired(true)),

    async execute(interaction) {
        await interaction.deferReply();
        const clientMessage = interaction.options.getString('text') || null;

        let response = '';
        const axios = require('axios');

        let data = JSON.stringify({
            "providers": "stabilityai",
            "text": clientMessage,
            "resolution": "512x512",
            "num_images": 2
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: process.env.EDENAI_API_URL,
            headers: {
                'authorization': process.env.EDENAI_API_AUTH_TOKEN,
                'content-type': 'application/json'
            },
            data: data
        };

        axios.request(config)
            .then(async (result) => {
                response = result.data[provider].items[0]["image_resource_url"]
                await interaction.editReply(`***Prompt:*** ${clientMessage}\n***Response:*** StabilityAi:${response}`);
            })
            .catch((error) => {
                logger.error(error);
            });
    },
};