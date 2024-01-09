const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const logger = require('../../../logger/logger');
const axios = require('axios');
const provider = 'stabilityai'; //stabilityai , openai, deepai
const { checkPermissions } = require('../../auth/permissions');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('image')
        .setDescription('Generate some image.').addStringOption(option =>
            option.setName('text')
                .setDescription('Input text')
                .setRequired(true)),

    async execute(interaction) {
        await interaction.deferReply();
        const hasPermission = await checkPermissions(interaction);
        
        if (!hasPermission) {
            return;
        }

        const clientMessage = interaction.options.getString('text') || null;

        let response = '';

        let data = JSON.stringify({
            "providers": provider,
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
                const embed = new EmbedBuilder()
                    .setImage(response);
                await interaction.editReply({ content: `***Prompt:*** ${clientMessage}`, embeds: [embed] })
            })
            .catch((error) => {
                logger.error(error);
            });
    },
};