const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const logger = require('../../../logger/logger');
const API_BASE_URL = process.env.VALORANT_API_BASE_URL;
const prefix = ''; //development- , ''
const aiWizardURL = process.env.AI_WIZARD_IMGUR_URL;
const embedLimit = 10; //Discord API Limit

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`${prefix}valorant-skin`)
        .setDescription('Provides valorant skin details.').addStringOption(option =>
            option.setName('name')
                .setDescription('Partial / full name of the skin')
                .setRequired(true)),

    async execute(interaction) {
        await interaction.deferReply();

        const clientMessage = interaction.options.getString('name') || null;

        if (clientMessage !== null) {
            const searchBySkinName = clientMessage;

            try {
                let config = {
                    method: 'get',
                    maxBodyLength: Infinity,
                    url: `${API_BASE_URL}/bundles`,
                    headers: {}
                };

                axios.request(config)
                    .then(async (result) => {
                        const skins = result.data.data;
                        const matchingSkins = skins.filter(skin =>
                            skin.displayName.toLowerCase().startsWith(searchBySkinName.toLowerCase())
                        );

                        if (matchingSkins[0]) {
                            const embeds = []
                            matchingSkins.forEach((element, index) => {

                                if (index >= embedLimit) {
                                    return;
                                }

                                const embed = new EmbedBuilder();

                                embed.setImage(element.verticalPromoImage);
                                embed.setTitle(`Bundle Name: ${element.displayName}`)
                                embed.setFooter({ text: 'AIWizard', iconURL: `${aiWizardURL}` });

                                embeds.push(embed);
                            });

                            await interaction.editReply({ content: `***Search Prompt:*** ${clientMessage}`, embeds: embeds })

                        } else {

                            const skinNames = skins.map(skin => skin.displayName).sort()

                            const skinNamesAsString = skinNames.join(' ,');

                            let embed = new EmbedBuilder();

                            embed = {
                                title: `Error: No matching results found!`,
                                image: {
                                    url: aiWizardURL,
                                },
                                description: `***List of available bundles: ***${skinNamesAsString}`,
                                footer: {
                                    text: 'AIWizard',
                                    icon_url: aiWizardURL,
                                },
                            }
                            //{ name: '\u200B', value: '\u200B' }, Adds empty spaces

                            await interaction.editReply({ content: `***Search Prompt:*** ${clientMessage}`, embeds: [embed] })
                        }
                    }).catch((error) => {
                        logger.log('error', error), 
                        interaction.editReply(`***Error***: Something went wrong, check the logs for info.`);
                    })

            } catch (error) {
                logger.error(error);
                await interaction.editReply(`***Error***: Something went wrong, check the logs for info.`);
                return;
            }

        }
    },
};