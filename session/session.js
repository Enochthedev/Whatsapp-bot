const qrcode = require('qrcode-terminal');
const { Client, RemoteAuth } = require('whatsapp-web.js');
const database = require('./database/db');


const createNewSession = async (id) => {
    const client = new Client({
        authStrategy: new RemoteAuth({
            botID: id,
            store: database.store,
            backupSyncIntervalMs: 300000
        })
    });
    console.log('Client created')
    console.log('Generating QR code...')
    client.on('qr', qr => {
        qrcode.generate(qr, {small: true});
    });
    client.on('authenticated', (session) => {
        console.log('Authenticated!');
        database.store.saveSession(session);
    });
    client.on('remote_session_saved', () => {
        console.log('Session saved successfully to remote store!');
    });
    client.on('ready', () => {
        console.log('Client is ready!');
    });
    client.initialize();
}

const getOldSession = async (id) => {
    const client = new Client({
        authStrategy: new RemoteAuth({
            botID: id,
            store: database.store,
            backupSyncIntervalMs: 300000
        })
    });
    console.log('Client found in database')
    client.on('ready', () => {
        console.log('Client is ready!');
    });
    client.initialize();

}

module.exports = {
    createNewSession,
    getOldSession
}