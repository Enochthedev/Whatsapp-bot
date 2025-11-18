import { Command } from '../types';
import { userService } from '../../services/user.service';
import { scheduleService } from '../../services/schedule.service';

// Stats command
export const statsCommand: Command = {
  name: 'stats',
  description: 'Show bot statistics',
  category: 'basic',
  handler: async ({ message }) => {
    try {
      const users = await userService.getAllUsers();
      const usersWithStrikes = await userService.getUsersWithStrikes();
      const schedules = await scheduleService.getActiveSchedules();

      const stats = `📊 *Bot Statistics*

👥 Total Users: ${users.length}
⚠️ Users with Strikes: ${usersWithStrikes.length}
📅 Active Schedules: ${schedules.length}
🤖 Platform: WhatsApp`;

      await message.reply(stats);
    } catch (error) {
      console.error('Error getting stats:', error);
      await message.reply('Failed to retrieve statistics.');
    }
  },
};

// Info command
export const infoCommand: Command = {
  name: 'info',
  description: 'Show bot information',
  category: 'basic',
  aliases: ['about'],
  handler: async ({ message }) => {
    const info = `ℹ️ *Coffee Bot WhatsApp*

A production-ready WhatsApp bot for group management and automation.

🔧 Version: 2.0.0
💻 Built with: TypeScript + Prisma
🌟 Features:
  • Group moderation
  • User strike system
  • Automated scheduling
  • Multi-platform ready

📚 Use /commands to see all available commands
🔗 GitHub: github.com/Enochthedev/Whatsapp-bot`;

    await message.reply(info);
  },
};

// Uptime command
export const uptimeCommand: Command = {
  name: 'uptime',
  description: 'Show bot uptime',
  category: 'basic',
  handler: async ({ message }) => {
    const uptime = process.uptime();
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);

    const uptimeStr = `⏱️ *Bot Uptime*

${days}d ${hours}h ${minutes}m ${seconds}s`;

    await message.reply(uptimeStr);
  },
};

// Schedule list command
export const scheduleListCommand: Command = {
  name: 'schedules',
  description: 'List all active schedules',
  category: 'advanced',
  requiresModerator: true,
  handler: async ({ message }) => {
    try {
      const schedules = await scheduleService.getActiveSchedules();

      if (schedules.length === 0) {
        await message.reply('No active schedules found.');
        return;
      }

      const scheduleList = schedules
        .map(
          (s, i) =>
            `${i + 1}. *${s.name}*\n   Cron: ${s.cronExpression}\n   Timezone: ${s.timezone}`
        )
        .join('\n\n');

      await message.reply(`📅 *Active Schedules*\n\n${scheduleList}`);
    } catch (error) {
      console.error('Error listing schedules:', error);
      await message.reply('Failed to list schedules.');
    }
  },
};

// User info command
export const whoIsCommand: Command = {
  name: 'whois',
  description: 'Get user information',
  category: 'basic',
  requiresGroup: true,
  handler: async ({ message, args }) => {
    const chat: any = await message.getChat();

    if (!chat.isGroup) {
      await message.reply('This command can only be used in groups.');
      return;
    }

    let targetUser: any;

    if (args.length === 0) {
      // Get info about self
      targetUser = await message.getContact();
    } else {
      // Get info about mentioned user
      const username = args[0].replace('@', '');
      const participant = chat.participants.find(
        (p: any) => p.id.user === username || p.id._serialized.includes(username)
      );

      if (!participant) {
        await message.reply('User not found in this group.');
        return;
      }

      targetUser = await message.getContact();
    }

    const userInfo = `👤 *User Information*

Name: ${targetUser.pushname || targetUser.name || 'Unknown'}
Number: ${targetUser.number || 'Hidden'}
ID: ${targetUser.id.user}
Is Contact: ${targetUser.isMyContact ? 'Yes' : 'No'}`;

    await message.reply(userInfo);
  },
};

// Group info command
export const groupInfoCommand: Command = {
  name: 'groupinfo',
  description: 'Get group information',
  category: 'basic',
  requiresGroup: true,
  handler: async ({ message }) => {
    const chat: any = await message.getChat();

    if (!chat.isGroup) {
      await message.reply('This command can only be used in groups.');
      return;
    }

    const admins = chat.participants.filter((p: any) => p.isAdmin || p.isSuperAdmin);

    const groupInfo = `📱 *Group Information*

Name: ${chat.name}
Participants: ${chat.participants.length}
Admins: ${admins.length}
Description: ${chat.description || 'No description'}
Created: ${chat.createdAt ? new Date(chat.createdAt * 1000).toLocaleDateString() : 'Unknown'}`;

    await message.reply(groupInfo);
  },
};

// Export all utility commands
export const utilityCommands: Command[] = [
  statsCommand,
  infoCommand,
  uptimeCommand,
  scheduleListCommand,
  whoIsCommand,
  groupInfoCommand,
];
