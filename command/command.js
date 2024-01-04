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

const admin = async (message) => {
    try {
        //get all current admins of the group and map them to a list of mentions
        const chat = await message.getChat();
        const admins = await chat.getAdmins();
        const mods = admins.map(admin => admin.mention());
        await message.reply(mods.join('\n'));
    } catch (error) {
        console.error('Error sending modslist:', error);
        await message.reply('Failed to retrieve mod list. Please try again later.');
    }
};

const commands = async (message) => {
    try {
        //use the export list to generate a dynamic list of commands
        const commands = Object.keys(module.exports).map(command => `/${command}`);
        await message.reply(commands.join('\n'));
    } catch (error) {
        console.error('Error sending help:', error);
        await message.reply('Failed to retrieve command list. Please try again later.');
    }
}

const tagAll = async (message) => {
    try {
        const chat = await message.getChat();
        const participants = chat.participants;
        const mentions = participants.map(participant => participant.mention()).join(' ');
        await message.reply(mentions);
    } catch (error) {
        console.error('Error tagging all:', error);
        await message.reply('Failed to tag all. Please try again later.');
    }
}

// command boilerplate
// const command = async (message) => {
//     try {
//         // command logic here
//     } catch (error) {
//         console.error('Error sending command reply:', error);
//         await message.reply('Failed to send command reply. Please try again later.');
//     }
// };


module.exports = {
    ping,
    helloworld,
    admin,
    commands,
    tagAll
    // Add more commands here as needed
};
