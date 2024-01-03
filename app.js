const qrcode = require('qrcode-terminal');
const { Client, RemoteAuth } = require('whatsapp-web.js');
const { MongoStore } = require('wwebjs-mongo');
const commands = require('./command/command');
const mongoose = require('mongoose');
require('dotenv').config();

console.log(process.env.MONGODB_URI)
try{
    mongoose.connect(process.env.MONGODB_URI).then(() => {
        const store = new MongoStore({ mongoose: mongoose });
        console.log('Connected to database')
        const client = new Client({
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

