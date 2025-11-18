import { Command } from '../types';
import { CONSTANTS } from '../../config/constants';
import { getRandomItem } from '../../utils/chat.utils';

// Ping command
export const pingCommand: Command = {
  name: 'ping',
  description: 'Test bot responsiveness',
  category: 'basic',
  handler: async ({ message }) => {
    await message.reply('pong');
  },
};

// Hello World command
export const helloWorldCommand: Command = {
  name: 'helloworld',
  description: 'Get a friendly greeting',
  category: 'basic',
  handler: async ({ message }) => {
    await message.reply('Hello, world!');
  },
};

// Admin list command
export const adminCommand: Command = {
  name: 'admin',
  description: 'List all group administrators',
  category: 'basic',
  requiresGroup: true,
  handler: async ({ message }) => {
    const chat: any = await message.getChat();

    if (!chat.isGroup) {
      await message.reply('This command can only be used in groups.');
      return;
    }

    const admins = chat.participants.filter((p: any) => p.isAdmin || p.isSuperAdmin);

    if (admins.length === 0) {
      await message.reply('No administrators found in this group.');
      return;
    }

    const adminMentions = admins.map((admin: any) => `@${admin.id.user}`).join('\n');
    await message.reply(`Group Administrators:\n${adminMentions}`);
  },
};

// Commands list command
export const commandsCommand: Command = {
  name: 'commands',
  description: 'List all available commands',
  category: 'basic',
  aliases: ['help'],
  handler: async ({ message }) => {
    // This will be populated by the command handler
    const { commandHandler } = await import('../handler');
    const commands = commandHandler.getCommands();

    const commandsByCategory: { [key: string]: string[] } = {
      basic: [],
      advanced: [],
      moderator: [],
      admin: [],
    };

    commands.forEach((cmd) => {
      commandsByCategory[cmd.category].push(`/${cmd.name} - ${cmd.description}`);
    });

    let response = '📋 *Available Commands*\n\n';

    if (commandsByCategory.basic.length > 0) {
      response += '*Basic Commands:*\n' + commandsByCategory.basic.join('\n') + '\n\n';
    }

    if (commandsByCategory.advanced.length > 0) {
      response += '*Advanced Commands:*\n' + commandsByCategory.advanced.join('\n') + '\n\n';
    }

    if (commandsByCategory.moderator.length > 0) {
      response += '*Moderator Commands:*\n' + commandsByCategory.moderator.join('\n') + '\n\n';
    }

    if (commandsByCategory.admin.length > 0) {
      response += '*Admin Commands:*\n' + commandsByCategory.admin.join('\n');
    }

    await message.reply(response);
  },
};

// Tag all members command (FIXED: removed undefined client variable)
export const tagAllCommand: Command = {
  name: 'tagall',
  description: 'Tag all group members',
  category: 'basic',
  requiresGroup: true,
  requiresAdmin: true,
  handler: async ({ message }) => {
    const chat: any = await message.getChat();

    if (!chat.isGroup) {
      await message.reply('This command can only be used in groups.');
      return;
    }

    const members = chat.participants.map((p: any) => `@${p.id.user}`);

    if (members.length === 0) {
      await message.reply('No members found in this group.');
      return;
    }

    await message.reply(`Tagging all members:\n${members.join('\n')}`);
  },
};

// Custom greetings command (FIXED: changed msg to message)
export const customGreetingsCommand: Command = {
  name: 'greet',
  description: 'Get a random Nigerian greeting',
  category: 'basic',
  aliases: ['greeting'],
  handler: async ({ message }) => {
    const chat = await message.getChat();
    const contact = await message.getContact();
    const randomGreeting = getRandomItem(CONSTANTS.GREETINGS);

    await chat.sendMessage(`${randomGreeting} @${contact.id.user}`);

    // If message has quoted message, greet that person too
    if (message.hasQuotedMsg) {
      const quotedMsg = await message.getQuotedMessage();
      const quotedContact = await quotedMsg.getContact();
      await chat.sendMessage(`${randomGreeting} @${quotedContact.id.user}`);
    }
  },
};

// Copy message command
export const copyMeCommand: Command = {
  name: 'copyme',
  description: 'Bot will copy your message',
  category: 'basic',
  handler: async ({ message, args }) => {
    const chat = await message.getChat();

    if (args.length === 0) {
      await message.reply('Please provide a message to copy.');
      return;
    }

    const messageToSend = args.join(' ');
    await chat.sendMessage(messageToSend);
  },
};

// Export all basic commands
export const basicCommands: Command[] = [
  pingCommand,
  helloWorldCommand,
  adminCommand,
  commandsCommand,
  tagAllCommand,
  customGreetingsCommand,
  copyMeCommand,
];
