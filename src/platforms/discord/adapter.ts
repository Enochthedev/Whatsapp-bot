import {
  PlatformAdapter,
  PlatformType,
  PlatformMessage,
  PlatformUser,
  PlatformChat,
  PlatformParticipant,
  SendMessageOptions,
} from '../base';

/**
 * Discord Platform Adapter (Example - Not Implemented)
 *
 * To implement Discord support:
 * 1. Install: npm install discord.js
 * 2. Implement the methods below using Discord.js Client
 * 3. Register this adapter in the platform factory
 *
 * Example usage:
 * ```typescript
 * import { Client, IntentsBitField } from 'discord.js';
 *
 * export class DiscordAdapter extends PlatformAdapter {
 *   private client: Client;
 *
 *   async initialize() {
 *     this.client = new Client({
 *       intents: [
 *         IntentsBitField.Flags.Guilds,
 *         IntentsBitField.Flags.GuildMessages,
 *         IntentsBitField.Flags.MessageContent,
 *       ]
 *     });
 *
 *     await this.client.login(process.env.DISCORD_TOKEN);
 *   }
 *
 *   // ... implement other methods
 * }
 * ```
 */
export class DiscordAdapter extends PlatformAdapter {
  platformType = PlatformType.DISCORD;

  async initialize(): Promise<void> {
    throw new Error('Discord adapter not yet implemented. See comments in file for implementation guide.');
  }

  async sendMessage(_options: SendMessageOptions): Promise<void> {
    throw new Error('Not implemented');
  }

  async replyToMessage(_messageId: string, _content: string): Promise<void> {
    throw new Error('Not implemented');
  }

  async getChat(_chatId: string): Promise<PlatformChat> {
    throw new Error('Not implemented');
  }

  async getUser(_userId: string): Promise<PlatformUser> {
    throw new Error('Not implemented');
  }

  async isUserAdmin(_chatId: string, _userId: string): Promise<boolean> {
    throw new Error('Not implemented');
  }

  async removeUser(_chatId: string, _userId: string): Promise<void> {
    throw new Error('Not implemented');
  }

  async getParticipants(_chatId: string): Promise<PlatformParticipant[]> {
    throw new Error('Not implemented');
  }

  async findChatByName(_name: string): Promise<PlatformChat | null> {
    throw new Error('Not implemented');
  }

  onMessage(_handler: (message: PlatformMessage) => Promise<void>): void {
    throw new Error('Not implemented');
  }

  async disconnect(): Promise<void> {
    throw new Error('Not implemented');
  }
}
