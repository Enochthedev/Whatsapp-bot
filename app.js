const qrcode = require('qrcode-terminal');
const { Client, RemoteAuth } = require('whatsapp-web.js');
const { MongoStore } = require('wwebjs-mongo');
const basicCommands = require('./commands/basic.command');
//const advancedCommands = require('./commands/advanced.command');
//const modCommands = require('./commands/mod.command');
const mongoose = require('mongoose');
const getAnnouncementChatId = require('./utils/random.function');
const scheduleMessageSending = require('./automations/automate')
require('dotenv').config();



const commands = {
    ...basicCommands,
    // ...advancedCommands, --- this command section is still in development
    // ...adminCommands --- this command section is still in development
    // ...modCommands --- this command section is still in development
};
//hard coded values for now
const scheduleData = [
    { chatId: 'CHAT_ID_1', message: 'Good morning! Time to get that pc up and running and commit your first line for the day …..or the year😴🔗', cronExpression: '0 8 * * *', timezone: 'Africa/Lagos' },
    { chatId: 'CHAT_ID_1', message: 'Ring Ring ⏰ what time is it? Its Commit time 🗣', cronExpression: '0 12 * * *', timezone: 'Africa/Lagos' },
    { chatId: 'CHAT_ID_1', message: 'Last lap Time for commit  number 3', cronExpression: '0 18 * * *', timezone: 'Africa/Lagos' },
    { chatId: 'CHAT_ID_1', message: 'Final commit of the day🥳 Time to push and shut-down for the day Cheers if you havve made it this far to those who have lost their streaks its never too late to restart , And if you havent then there always tomorrow to start. It all starts with a git', cronExpression: '0 22 * * *', timezone: 'Africa/Lagos' },
    // ... more schedules
  ];

let client;
//console.log(process.env.MONGODB_URI) testing env variables
try{
    mongoose.connect(process.env.MONGODB_URI).then(() => {
        const store = new MongoStore({ mongoose: mongoose });
        console.log('Connected to database')
        client = new Client({
            authStrategy: new RemoteAuth({
                store: store,
                backupSyncIntervalMs: 300000
            })
        });
        console.log('Client created')

        console.log('Generating QR code...')

        client.on('qr', qr => {
            qrcode.generate(qr, {small: true});
        });

        
        client.on('remote_session_saved', () => {
            
            console.log('Session saved successfully to remote store!');
        });

        client.on('ready', () => {
            console.log('Client is ready!');
        });

        client.initialize();

        client.on('ready', () => {
            getAnnouncementChatId(client)
            .then(announcementChatId => {
                if (announcementChatId) {
                console.log('Announcement chat ID:', announcementChatId);

                // Update scheduleData with the retrieved chat ID
                scheduleData.forEach(schedule => {
                    if (schedule.chatId === 'CHAT_ID_1') {
                    schedule.chatId = announcementChatId;
                    }
                });

                // Schedule messages using the updated data
                scheduleData.forEach(schedule => {
                    scheduleMessageSending(schedule.chatId, schedule.message, schedule.cronExpression, schedule.timezone);
                });
                } else {
                console.error('Announcement chat not found. Please add the bot to the chat and restart.');
                }
            })
            .catch(error => {
                console.error('Error getting announcement chat ID:', error);
            });
        });
        ///commands
        client.on('message', async (message) => {
            const commandName = message.body.slice(1); // Extract command name from message
            const commandHandler = commands[commandName];
        
            if (commandHandler) {
                try {
                    await commandHandler(message);
                } catch (error) {
                    console.error('Error handling command:', error);
                    await message.reply('Something went wrong. Please try again later.');
                }
            }
        });


    });
}catch(err){
    console.log(err)
}


module.exports = client;

