const cron = require('node-cron');
const { client } = require('../app.js');

const scheduleMessageSending = async (chatId, messageToSend, cronExpression, timezone) => {
    cron.schedule(cronExpression, async () => {
        try {
        if (client) {
            // Client is available, use it directly
            await client.sendMessage(chatId, messageToSend);
            console.log(`Message "${messageToSend}" sent successfully to chat ${chatId}`);
        } else {
            // Handle the situation where the client is not available
            console.error('Client is not initialized. Cannot send messages.');
        }
        } catch (error) {
        console.error(`Error sending message to chat ${chatId}:`, error);
        }
    }, {
        scheduled: true,
        timezone,
    });
};

module.exports = scheduleMessageSending;
