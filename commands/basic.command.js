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
        await client.getGroupMetaData(message.chatId).then(async (groupData) => {
            let members = [];
            for (i = 0; i < groupData.participants.length; i++) {
                members.push(groupData.participants[i].id.user);
            }
            await message.reply(members.join('\n'));
        });
    } catch (error) {
        console.error('Error tagging all:', error);
        await message.reply('Failed to tag all. Please try again later.');
    }
}

const customGreetings = async (message) => {
    try {
        const randomGreetings ={
            'How far boss!': 'How far boss!',
            'Agba dev na you o!': 'Agba dev na you o!',
            'Hello boss!': 'Hello boss!',
        }
        const chat = await msg.getChat();
        const contact = await msg.getContact();
        //cycle through random greetings
        const randomGreeting = randomGreetings[Math.floor(Math.random() * randomGreetings.length)];
        await chat.sendMessage(`${randomGreeting} @${contact.id.user}`);
        if (msg.hasQuotedMsg) {
            const quotedMsg = await msg.getQuotedMessage();
            const quotedContact = await quotedMsg.getContact();
            await chat.sendMessage(`Hello @${quotedContact.id.user}`);
        }
        // await chat.sendMessage(`Hello @${contact.id.user}`, {
        //         mentions: [contact]
        //     });
    } catch (error) {
        console.error('Error tagging all:', error);
        await message.reply('Failed to tag all. Please try again later.');
    }
}
const copyMe = async (message) => {
    try {
        const chat = await message.getChat();
        //remove the keyword from the message and send the rest
        const messageToSend = message.body.slice(9);
        await chat.sendMessage(messageToSend);
    } catch (error) {
        console.error('Error copying message:', error);
        await message.reply('Failed to copy message. Please try again later.');
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
    tagAll,
    customGreetings,
    copyMe
    // Add more commands here as needed
};
