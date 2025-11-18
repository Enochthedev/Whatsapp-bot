import { Message } from 'whatsapp-web.js';
import { CONSTANTS } from '../config/constants';

/**
 * Check if message sender has admin permissions
 */
export async function hasAdminPermissions(message: Message): Promise<boolean> {
  try {
    const chat: any = await message.getChat();

    // Only works in group chats
    if (!chat.isGroup) {
      return false;
    }

    const sender = await message.getContact();
    const admins = await chat.participants.filter((p: any) => p.isAdmin || p.isSuperAdmin);
    const isAdmin = admins.some((admin: any) => admin.id._serialized === sender.id._serialized);

    if (!isAdmin) {
      await message.reply(CONSTANTS.MESSAGES.ADMIN_ONLY);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error checking admin permissions:', error);
    await message.reply(CONSTANTS.MESSAGES.ERROR_GENERIC);
    return false;
  }
}

/**
 * Check if message sender has moderator permissions
 * Note: Currently checks for admin status. Can be extended to check database for moderator role
 */
export async function hasModPermissions(message: Message): Promise<boolean> {
  try {
    const chat: any = await message.getChat();

    // Only works in group chats
    if (!chat.isGroup) {
      return false;
    }

    const sender = await message.getContact();
    const admins = await chat.participants.filter((p: any) => p.isAdmin || p.isSuperAdmin);
    const isAdmin = admins.some((admin: any) => admin.id._serialized === sender.id._serialized);

    if (!isAdmin) {
      await message.reply(CONSTANTS.MESSAGES.MODERATOR_ONLY);
      return false;
    }

    // TODO: Can extend this to also check database for isModerator flag
    // const user = await userService.findByPhoneNumber(sender.number);
    // if (user && user.isModerator) return true;

    return true;
  } catch (error) {
    console.error('Error checking moderator permissions:', error);
    await message.reply(CONSTANTS.MESSAGES.ERROR_GENERIC);
    return false;
  }
}

/**
 * Check if user is a group participant
 */
export async function isGroupParticipant(message: Message, phoneNumber: string): Promise<boolean> {
  try {
    const chat: any = await message.getChat();

    if (!chat.isGroup) {
      return false;
    }

    return chat.participants.some((p: any) => p.id.user === phoneNumber);
  } catch (error) {
    console.error('Error checking group participation:', error);
    return false;
  }
}
