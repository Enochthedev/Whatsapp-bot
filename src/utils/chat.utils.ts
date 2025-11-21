import { Client, Chat } from 'whatsapp-web.js';
import { getAnnouncementKeywords, env } from '../config/environment';

/**
 * Find a chat by name (exact match)
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
 * Find chats that match any of the given keywords (case-insensitive)
 */
export async function findChatsByKeywords(client: Client, keywords: string[]): Promise<Chat[]> {
  try {
    const chats = await client.getChats();
    const groupChats = chats.filter((c) => c.isGroup);

    return groupChats.filter((chat) => {
      const chatName = chat.name?.toLowerCase() || '';
      return keywords.some((keyword) => chatName.includes(keyword));
    });
  } catch (error) {
    console.error('Error finding chats by keywords:', error);
    return [];
  }
}

/**
 * Auto-detect announcement channel
 * Searches for group chats that match announcement keywords
 */
export async function autoDetectAnnouncementChannel(client: Client): Promise<Chat | null> {
  try {
    const keywords = getAnnouncementKeywords();
    console.log(`🔍 Searching for announcement channels with keywords: ${keywords.join(', ')}`);

    const matchingChats = await findChatsByKeywords(client, keywords);

    if (matchingChats.length > 0) {
      // Return the first matching chat
      const chat = matchingChats[0];
      console.log(`✅ Auto-detected announcement channel: "${chat.name}"`);

      if (matchingChats.length > 1) {
        console.log(`   Found ${matchingChats.length} matching channels:`);
        matchingChats.forEach((c, i) => console.log(`   ${i + 1}. ${c.name}`));
        console.log(`   Using first match: "${chat.name}"`);
      }

      return chat;
    }

    console.log('⚠️ No announcement channels found with auto-detection');
    return null;
  } catch (error) {
    console.error('Error auto-detecting announcement channel:', error);
    return null;
  }
}

/**
 * Get announcement chat ID with smart detection
 * 1. First tries auto-detection using keywords
 * 2. Falls back to specific channel name if configured
 * 3. Returns null if nothing found (bot continues without announcements)
 */
export async function getAnnouncementChatId(client: Client): Promise<string | null> {
  try {
    // Step 1: Try auto-detection
    const autoDetected = await autoDetectAnnouncementChannel(client);
    if (autoDetected) {
      return autoDetected.id._serialized;
    }

    // Step 2: Try fallback channel name if configured
    const fallback = env.ANNOUNCEMENT_CHANNEL_FALLBACK;
    if (fallback) {
      console.log(`🔍 Trying fallback channel: "${fallback}"`);
      const fallbackChat = await findChatByName(client, fallback);
      if (fallbackChat) {
        console.log(`✅ Found fallback announcement channel: "${fallbackChat.name}"`);
        return fallbackChat.id._serialized;
      }
    }

    // Step 3: No channel found - bot continues without announcements
    console.log('ℹ️ No announcement channel configured. Scheduled messages will be skipped.');
    console.log('   To enable: Add bot to a group with "announcement", "updates", or "news" in the name');
    return null;
  } catch (error) {
    console.error('Error getting announcement chat ID:', error);
    return null;
  }
}

/**
 * Get all group chats
 */
export async function getAllGroups(client: Client): Promise<Chat[]> {
  try {
    const chats = await client.getChats();
    return chats.filter((c) => c.isGroup);
  } catch (error) {
    console.error('Error getting groups:', error);
    return [];
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
