const fs = require('fs');
const path = require('path');
const assetDirPath = path.join(__dirname, '..', 'assets/email-templates');
const TRANSACTION = require('../constants/transactions');
const fromAddress = 'AI Discord Bot <ai.discord-bot@buddies.com>';


//#Transactional Emails
function currentBalanceTemplateBuilder(dynamicFields) {
    const template = fs.readFileSync(path.join(assetDirPath, 'current-bank-balance.html')).toString();
    return template.replace(/{{USER}}/g, dynamicFields.toUser).replace(/{{CURRENT_BALANCE}}/g, dynamicFields.currentBalance).replace(/{{currentDate}}/g, dynamicFields.currentDate);
}

function formatEmailTemplatesByEmailTypeAndUserInput(type, recipientemailId, dynamicFields) {
    let emailInput;
    let body;

    switch (type) {
        case TRANSACTION.CURRENT_BALANCE:
            body = currentBalanceTemplateBuilder(dynamicFields)
            emailInput = {
                from: fromAddress,
                to: recipientemailId,
                subject: "ACCOUNT BALANCE UPDATE",
                body: body
            }
            break;
    }

    return emailInput;
}

module.exports = {
    formatEmailTemplatesByEmailTypeAndUserInput
}