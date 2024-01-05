const { client } = require('../app.js');

async function getAnnouncementChatId(client) {
    try {
        const chats = await client.getChats();

        const announcementChat = chats.find(chat => {
        // Modify this condition to match the announcement chat's name or other identifying criteria
        return chat.name === 'Announcements';
        });

        if (announcementChat) {
        console.log('Announcement chat ID:', announcementChat.id._serialized);
        return announcementChat.id._serialized; // Return the ID for further use
        } else {
        console.error('Announcement chat not found. Please add the bot to the chat and try again.');
        return null; // Or throw an error if preferred
        }
    } catch (error) {
        console.error('Error retrieving chats:', error);
        return null; // Or throw an error if preferred
    }
}

module.exports = getAnnouncementChatId;
