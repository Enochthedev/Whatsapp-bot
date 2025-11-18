import { Command } from '../types';
import { userService } from '../../services/user.service';
import { extractPhoneNumber } from '../../utils/chat.utils';

// Promote user to moderator
export const promoteCommand: Command = {
  name: 'promote',
  description: 'Promote a user to moderator',
  category: 'admin',
  requiresGroup: true,
  requiresAdmin: true,
  handler: async ({ message, args }) => {
    if (args.length === 0) {
      await message.reply('Please mention a user to promote.\nUsage: /promote @username');
      return;
    }

    const chat: any = await message.getChat();

    if (!chat.isGroup) {
      await message.reply('This command can only be used in groups.');
      return;
    }

    const username = args[0].replace('@', '');
    const participant = chat.participants.find(
      (p: any) => p.id.user === username || p.id._serialized.includes(username)
    );

    if (!participant) {
      await message.reply('User not found in this group.');
      return;
    }

    const phoneNumber = extractPhoneNumber(participant.id._serialized);

    try {
      await userService.findOrCreate(phoneNumber);
      await userService.updateRole(phoneNumber, { isModerator: true });
      await message.reply(`✅ @${phoneNumber} has been promoted to moderator!`);
    } catch (error) {
      console.error('Error promoting user:', error);
      await message.reply('Failed to promote user.');
    }
  },
};

// Demote user from moderator
export const demoteCommand: Command = {
  name: 'demote',
  description: 'Demote a user from moderator',
  category: 'admin',
  requiresGroup: true,
  requiresAdmin: true,
  handler: async ({ message, args }) => {
    if (args.length === 0) {
      await message.reply('Please mention a user to demote.\nUsage: /demote @username');
      return;
    }

    const chat: any = await message.getChat();

    if (!chat.isGroup) {
      await message.reply('This command can only be used in groups.');
      return;
    }

    const username = args[0].replace('@', '');
    const participant = chat.participants.find(
      (p: any) => p.id.user === username || p.id._serialized.includes(username)
    );

    if (!participant) {
      await message.reply('User not found in this group.');
      return;
    }

    const phoneNumber = extractPhoneNumber(participant.id._serialized);

    try {
      await userService.updateRole(phoneNumber, { isModerator: false });
      await message.reply(`✅ @${phoneNumber} has been demoted from moderator.`);
    } catch (error) {
      console.error('Error demoting user:', error);
      await message.reply('Failed to demote user.');
    }
  },
};

// List all moderators
export const moderatorsCommand: Command = {
  name: 'moderators',
  description: 'List all moderators',
  category: 'basic',
  aliases: ['mods'],
  handler: async ({ message }) => {
    try {
      const users = await userService.getAllUsers();
      const moderators = users.filter((u) => u.isModerator || u.isAdmin);

      if (moderators.length === 0) {
        await message.reply('No moderators found in the database.');
        return;
      }

      const modList = moderators
        .map((m) => `• @${m.phoneNumber} ${m.name ? `(${m.name})` : ''}`)
        .join('\n');

      await message.reply(`👮 *Moderators*\n\n${modList}`);
    } catch (error) {
      console.error('Error listing moderators:', error);
      await message.reply('Failed to list moderators.');
    }
  },
};

// Clear all strikes for everyone
export const clearAllStrikesCommand: Command = {
  name: 'clearallstrikes',
  description: 'Clear all strikes for all users',
  category: 'admin',
  requiresAdmin: true,
  handler: async ({ message }) => {
    try {
      const usersWithStrikes = await userService.getUsersWithStrikes();

      for (const user of usersWithStrikes) {
        await userService.resetStrikes(user.phoneNumber);
      }

      await message.reply(
        `✅ Cleared strikes for ${usersWithStrikes.length} user(s).`
      );
    } catch (error) {
      console.error('Error clearing all strikes:', error);
      await message.reply('Failed to clear all strikes.');
    }
  },
};

// Announcement command
export const announceCommand: Command = {
  name: 'announce',
  description: 'Send an announcement to the group',
  category: 'admin',
  requiresGroup: true,
  requiresAdmin: true,
  handler: async ({ message, args }) => {
    if (args.length === 0) {
      await message.reply(
        'Please provide an announcement message.\nUsage: /announce Your message here'
      );
      return;
    }

    const announcement = args.join(' ');
    const chat = await message.getChat();

    await chat.sendMessage(
      `📢 *ANNOUNCEMENT*\n\n${announcement}\n\n_Posted by admin_`
    );
  },
};

// Broadcast command (send to all groups)
export const broadcastCommand: Command = {
  name: 'broadcast',
  description: 'Broadcast a message to all groups',
  category: 'admin',
  requiresAdmin: true,
  handler: async ({ message, args }) => {
    if (args.length === 0) {
      await message.reply(
        'Please provide a broadcast message.\nUsage: /broadcast Your message here'
      );
      return;
    }

    await message.reply(
      '⚠️ Broadcast command is disabled for safety. Enable it in the code if needed.'
    );

    // Uncomment to enable broadcasting
    /*
    const broadcastMessage = args.join(' ');
    const chats = await client.getChats();
    const groups = chats.filter(c => c.isGroup);

    let count = 0;
    for (const group of groups) {
      try {
        await group.sendMessage(`📢 *BROADCAST*\n\n${broadcastMessage}`);
        count++;
      } catch (error) {
        console.error(`Failed to broadcast to ${group.name}:`, error);
      }
    }

    await message.reply(`✅ Broadcast sent to ${count} group(s).`);
    */
  },
};

// View leaderboard (users with most strikes)
export const leaderboardCommand: Command = {
  name: 'leaderboard',
  description: 'View strike leaderboard',
  category: 'basic',
  aliases: ['lb', 'top'],
  handler: async ({ message }) => {
    try {
      const usersWithStrikes = await userService.getUsersWithStrikes();

      if (usersWithStrikes.length === 0) {
        await message.reply('No users with strikes found.');
        return;
      }

      const top10 = usersWithStrikes.slice(0, 10);
      const leaderboard = top10
        .map(
          (user, i) =>
            `${i + 1}. @${user.phoneNumber} - ${user.numberOfStrikes} strike(s)`
        )
        .join('\n');

      await message.reply(`🏆 *Strike Leaderboard*\n\n${leaderboard}`);
    } catch (error) {
      console.error('Error showing leaderboard:', error);
      await message.reply('Failed to show leaderboard.');
    }
  },
};

// Export all admin commands
export const adminCommands: Command[] = [
  promoteCommand,
  demoteCommand,
  moderatorsCommand,
  clearAllStrikesCommand,
  announceCommand,
  broadcastCommand,
  leaderboardCommand,
];
