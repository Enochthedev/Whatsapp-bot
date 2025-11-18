import { Client, Chat } from 'whatsapp-web.js';

/**
 * Find a chat by name
 */
export async function findChatByName(client: Client, chatName: string): Promise<Chat | null> {
  try {
    const chats = await client.getChats();
    const chat = chats.find((c) => c.name === chatName);
    return chat || null;
  } catch (error) {
    console.error('Error finding chat by name:', error);
    return null;
  }
}

/**
 * Get announcement chat ID
 */
export async function getAnnouncementChatId(
  client: Client,
  chatName: string
): Promise<string | null> {
  try {
    const chat = await findChatByName(client, chatName);

    if (chat) {
      console.log(`✅ Found announcement chat: ${chat.name} (${chat.id._serialized})`);
      return chat.id._serialized;
    } else {
      console.error(
        `❌ Announcement chat "${chatName}" not found. Please add the bot to the chat and restart.`
      );
      return null;
    }
  } catch (error) {
    console.error('Error getting announcement chat ID:', error);
    return null;
  }
}

/**
 * Extract phone number from WhatsApp ID
 */
export function extractPhoneNumber(whatsappId: string): string {
  // WhatsApp ID format: phoneNumber@c.us or phoneNumber@g.us
  return whatsappId.split('@')[0];
}

/**
 * Format mention string
 */
export function formatMention(phoneNumber: string): string {
  return `@${phoneNumber}`;
}

/**
 * Get random item from array
 */
export function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}
