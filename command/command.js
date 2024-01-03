// commands.js
const ping = async (message) => {
    try {
        await message.reply('pong');
    } catch (error) {
        console.error('Error sending ping reply:', error);
        await message.reply('Failed to send pong. Please try again later.');
    }
};

const helloworld = async (message) => {
    try {
        await message.reply('Hello, world!');
    } catch (error) {
        console.error('Error sending helloworld reply:', error);
        await message.reply('Failed to send helloworld message. Please try again later.');
    }
};

const modslist = async (message) => {
    try {
        const mods = ['mod1', 'mod2', 'mod3']; // Replace with your actual mod list
        await message.reply(mods.join('\n'));
    } catch (error) {
        console.error('Error sending modslist:', error);
        await message.reply('Failed to retrieve mod list. Please try again later.');
    }
};

module.exports = {
    ping,
    helloworld,
    modslist,
    // Add more commands here as needed
};
