const cron = require('node-cron');

const scheduleMessageSending = (chatId, messageToSend, cronExpression, timezone) => {
    cron.schedule(cronExpression, async () => {
        try {
            const client = await getClient(); // Retrieve the client instance
            await client.sendMessage(chatId, messageToSend);
            console.log(`Message "${messageToSend}" sent successfully to chat ${chatId}`);
        } catch (error) {
            console.error(`Error sending message to chat ${chatId}:`, error);
        }
        }, {
        scheduled: true,
        timezone,
        });
};


module.exports = scheduleMessageSending;
