const axios = require('axios');
const MAILGUN_TOKEN = process.env.MAILGUN_TOKEN;
const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;

class MailgunEmailProvider {
    constructor() {
        this.apiKey = MAILGUN_API_KEY;
        this.baseURL = 'https://api.mailgun.net/v3/sandbox297138fd72454b3aa29aea337f0f2fd5.mailgun.org';
        this.authHeader = `Basic ${MAILGUN_TOKEN}`;
    }

    async sendEmail(emailInput) {
        const {from, to, subject, body} = emailInput;
        try {
            const response = await axios.post(
                `${this.baseURL}/messages`,
                { from, to, subject, html: body },
                {
                    headers: {
                        'Authorization': this.authHeader,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Failed to send email: ' + error);
        }
    }
}

module.exports = MailgunEmailProvider