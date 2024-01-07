const { SlashCommandBuilder } = require('discord.js');
const OpenAI = require('openai');
const logger = require('../../../logger/logger');
const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_API_KEY
});
const model = "text-davinci-003";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ask')
        .setDescription('Provides response from ChatGPT.').addStringOption(option =>
            option.setName('question')
                .setDescription('The question that you want answered')
                .setRequired(true)),

    async execute(interaction) {
        await interaction.deferReply();
        const clientMessage = interaction.options.getString('question') || null;

        let response = '';

        if (clientMessage !== null) {
            const promptText = clientMessage;

            const completion = await openai.completions.create({
                model: model,
                prompt: promptText,
                max_tokens: 50,
            });
            response = completion.choices[0].text.trim().replace(/^\s+/, '');
            logger.info(response);
        }

        await interaction.editReply(`***Question:*** ${clientMessage}\n***Response:*** ${response}`);

    },
};