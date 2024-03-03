const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const logger = require('../../../logger/logger');
const prefix = ''; //development- , ''
const aiWizardURL = process.env.AI_WIZARD_IMGUR_URL;
const util = require('../../utils/email-builder');
const TRANSACTION = require('../../constants/transactions');
const EmailProvider = require('../../email-service/mailgun-email');
const { checkPermissions } = require('../../auth/permissions');

const emailClient = new EmailProvider();
const users = [{
    name: 'Xavier',
    email: 'xavierreactsrobin@gmail.com'
},{
    name:'Leander Robin',
    email: 'leander.lrsam@gmail.com'
}]

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`${prefix}update-balance`)
        .setDescription('Private Balance update, triggers email and returns balance message in embeds').addStringOption(option =>
            option.setName('amount')
                .setDescription('Amount in INR (Numbers Only) Ex: 50,000')
                .setRequired(true)),

    async execute(interaction) {
        await interaction.deferReply();

        const hasPermission = await checkPermissions(interaction);
        
        if (!hasPermission) {
            return;
        }

        const clientMessage = interaction.options.getString('amount') || null;
        const amount = Number(clientMessage);

        if (clientMessage !== null && !isNaN(amount)) {
            const options = { timeZone: 'Asia/Kolkata', year: 'numeric', month: 'long', day: 'numeric' };
            const currentDate = new Date().toLocaleDateString('en-IN', options);
            try {
                users.forEach((currentUser) => {
                    const emailInput = util.formatEmailTemplatesByEmailTypeAndUserInput(
                        TRANSACTION.CURRENT_BALANCE,
                        currentUser.email,
                        { toUser: currentUser.name, currentBalance: amount, currentDate }
                    );
                    emailClient.sendEmail(emailInput); //Triggers Email
                });
                let embed = new EmbedBuilder();
                embed = {
                    title: `Balance Update`,
                    description: `**Current Balance**: ${amount} Rs (INR)\n **Date**: ${currentDate}`,
                    footer: {
                        text: 'AIWizard',
                        icon_url: aiWizardURL,
                    },
                }
                await interaction.editReply({ embeds: [embed] })

            } catch (error) {
                logger.error(error);
                await interaction.editReply(`***Error***: Something went wrong, check the logs for info.`);
                return;
            }
        } else {
            await interaction.editReply(`***Error***: Amount must be a Number!`);
        }
    }
}