const errorCodes = require('../error-codes/permissions')
const allowedUsers = process.env.ALLOWED_USERS; //array

async function checkPermissions(interaction) {
    const interactionUser = interaction.user.username;
    
    if (!allowedUsers.includes(interactionUser)) {
        await interaction.editReply({ content: errorCodes.NO_REQUIRED_PERMISSIONS_TO_EXECUTE_THIS_COMMAND });
        return false;
    }

    return true;
}

module.exports = { checkPermissions };