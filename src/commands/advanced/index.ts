import { Command } from '../types';
import { userService } from '../../services/user.service';
import { CONSTANTS } from '../../config/constants';
import { extractPhoneNumber } from '../../utils/chat.utils';

// Report command
export const reportCommand: Command = {
  name: 'report',
  description: 'Report a user (adds a strike)',
  category: 'advanced',
  requiresGroup: true,
  requiresModerator: true,
  handler: async ({ message, args }) => {
    if (args.length === 0) {
      await message.reply(
        'Please mention the user to report.\nUsage: /report @username or /report username'
      );
      return;
    }

    const chat: any = await message.getChat();

    if (!chat.isGroup) {
      await message.reply('This command can only be used in groups.');
      return;
    }

    const reportedUsername = args[0].replace('@', '');

    // Find participant by name
    const participantToReport = chat.participants.find(
      ​(participant: any) =>
        participant.id.user === reportedUsername ||
        participant.id._serialized.includes(reportedUsername)
    );

    if (!participantToReport) {
      await message.reply(CONSTANTS.MESSAGES.PARTICIPANT_NOT_FOUND);
      return;
    }

    const phoneNumber = extractPhoneNumber(participantToReport.id._serialized);

    try {
      // Find or create user
      await userService.findOrCreate(phoneNumber);

      // Add strike
      const { user, shouldKick } = await userService.addStrike(phoneNumber);

      await message.reply(
        `⚠️ @${phoneNumber} has received a strike.\nTotal strikes: ${user.numberOfStrikes}/${CONSTANTS.STRIKES.MAX_STRIKES}`
      );

      if (shouldKick) {
        await message.reply(
          `🚫 @${phoneNumber} has been removed from the group due to reaching ${CONSTANTS.STRIKES.MAX_STRIKES} strikes.`
        );
        await chat.removeParticipants([participantToReport.id._serialized]);
      }
    } catch (error) {
      console.error('Error handling report command:', error);
      await message.reply('Failed to report user. Please try again later.');
    }
  },
};

// View strikes command
export const strikesCommand: Command = {
  name: 'strikes',
  description: 'View your strikes or another user strikes',
  category: 'advanced',
  requiresGroup: true,
  handler: async ({ message, args }) => {
    const chat: any = await message.getChat();

    if (!chat.isGroup) {
      await message.reply('This command can only be used in groups.');
      return;
    }

    let phoneNumber: string;

    if (args.length === 0) {
      // Check own strikes
      const contact = await message.getContact();
      phoneNumber = contact.number;
    } else {
      // Check someone else's strikes
      const username = args[0].replace('@', '');
      const participant = chat.participants.find(
        ​(p: any) => p.id.user === username || p.id._serialized.includes(username)
      );

      if (!participant) {
        await message.reply(CONSTANTS.MESSAGES.PARTICIPANT_NOT_FOUND);
        return;
      }

      phoneNumber = extractPhoneNumber(participant.id._serialized);
    }

    try {
      const user = await userService.findByPhoneNumber(phoneNumber);

      if (!user) {
        await message.reply('User has no strikes recorded.');
        return;
      }

      await message.reply(
        `Strikes for @${phoneNumber}: ${user.numberOfStrikes}/${CONSTANTS.STRIKES.MAX_STRIKES}`
      );
    } catch (error) {
      console.error('Error checking strikes:', error);
      await message.reply('Failed to check strikes. Please try again later.');
    }
  },
};

// Reset strikes command
export const resetStrikesCommand: Command = {
  name: 'resetstrikes',
  description: 'Reset a user strikes (moderator only)',
  category: 'advanced',
  requiresGroup: true,
  requiresModerator: true,
  handler: async ({ message, args }) => {
    if (args.length === 0) {
      await message.reply('Please mention the user.\nUsage: /resetstrikes @username');
      return;
    }

    const chat: any = await message.getChat();

    if (!chat.isGroup) {
      await message.reply('This command can only be used in groups.');
      return;
    }

    const username = args[0].replace('@', '');
    const participant = chat.participants.find(
      ​(p: any) => p.id.user === username || p.id._serialized.includes(username)
    );

    if (!participant) {
      await message.reply(CONSTANTS.MESSAGES.PARTICIPANT_NOT_FOUND);
      return;
    }

    const phoneNumber = extractPhoneNumber(participant.id._serialized);

    try {
      const user = await userService.findByPhoneNumber(phoneNumber);

      if (!user) {
        await message.reply('User has no strikes recorded.');
        return;
      }

      await userService.resetStrikes(phoneNumber);
      await message.reply(`✅ Strikes reset for @${phoneNumber}`);
    } catch (error) {
      console.error('Error resetting strikes:', error);
      await message.reply('Failed to reset strikes. Please try again later.');
    }
  },
};

// Export all advanced commands
export const advancedCommands: Command[] = [reportCommand, strikesCommand, resetStrikesCommand];
