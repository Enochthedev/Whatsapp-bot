import { Command } from '../types';
import { CONSTANTS } from '../../config/constants';
import { extractPhoneNumber } from '../../utils/chat.utils';

// Kick command
export const kickCommand: Command = {
  name: 'kick',
  description: 'Remove a user from the group',
  category: 'moderator',
  requiresGroup: true,
  requiresModerator: true,
  handler: async ({ message, args }) => {
    if (args.length === 0) {
      await message.reply('Please mention the user to kick.\nUsage: /kick @username');
      return;
    }

    const chat: any = await message.getChat();

    if (!chat.isGroup) {
      await message.reply('This command can only be used in groups.');
      return;
    }

    const kickedUsername = args[0].replace('@', '');

    // Find participant by username
    const participantToKick = chat.participants.find(
      ​(participant: any) =>
        participant.id.user === kickedUsername ||
        participant.id._serialized.includes(kickedUsername)
    );

    if (!participantToKick) {
      await message.reply(CONSTANTS.MESSAGES.PARTICIPANT_NOT_FOUND);
      return;
    }

    const phoneNumber = extractPhoneNumber(participantToKick.id._serialized);

    try {
      // Inform the group about the action
      await message.reply(
        `🚫 @${phoneNumber} has been removed from the group. Thank you for keeping this group safe.`
      );

      // Remove the participant
      await chat.removeParticipants([participantToKick.id._serialized]);
      console.log(`✅ ${kickedUsername} removed successfully.`);
    } catch (error) {
      console.error('Error removing participant:', error);
      await message.reply('Failed to remove participant. Please try again later.');
    }
  },
};

// Ban command (kick + prevent from rejoining)
export const banCommand: Command = {
  name: 'ban',
  description: 'Ban a user from the group',
  category: 'moderator',
  requiresGroup: true,
  requiresModerator: true,
  handler: async ({ message, args }) => {
    if (args.length === 0) {
      await message.reply('Please mention the user to ban.\nUsage: /ban @username');
      return;
    }

    const chat: any = await message.getChat();

    if (!chat.isGroup) {
      await message.reply('This command can only be used in groups.');
      return;
    }

    const bannedUsername = args[0].replace('@', '');

    // Find participant
    const participantToBan = chat.participants.find(
      ​(participant: any) =>
        participant.id.user === bannedUsername || participant.id._serialized.includes(bannedUsername)
    );

    if (!participantToBan) {
      await message.reply(CONSTANTS.MESSAGES.PARTICIPANT_NOT_FOUND);
      return;
    }

    const phoneNumber = extractPhoneNumber(participantToBan.id._serialized);

    try {
      await message.reply(`🚫 @${phoneNumber} has been banned from the group.`);
      await chat.removeParticipants([participantToBan.id._serialized]);
      console.log(`✅ ${bannedUsername} banned successfully.`);
    } catch (error) {
      console.error('Error banning participant:', error);
      await message.reply('Failed to ban participant. Please try again later.');
    }
  },
};

// Mute command
export const muteCommand: Command = {
  name: 'mute',
  description: 'Mute a user in the group',
  category: 'moderator',
  requiresGroup: true,
  requiresModerator: true,
  handler: async ({ message }) => {
    await message.reply(
      'Note: Muting individual users is not yet supported by whatsapp-web.js. Use group settings to mute all participants.'
    );
  },
};

// Export all moderator commands
export const moderatorCommands: Command[] = [kickCommand, banCommand, muteCommand];
