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
 * Twitter/X Platform Adapter (Example - Not Implemented)
 *
 * To implement Twitter support:
 * 1. Install: npm install twitter-api-v2
 * 2. Implement the methods below using TwitterApi
 * 3. Register this adapter in the platform factory
 *
 * Example usage:
 * ```typescript
 * import { TwitterApi } from 'twitter-api-v2';
 *
 * export class TwitterAdapter extends PlatformAdapter {
 *   private client: TwitterApi;
 *
 *   async initialize() {
 *     this.client = new TwitterApi({
 *       appKey: process.env.TWITTER_API_KEY!,
 *       appSecret: process.env.TWITTER_API_SECRET!,
 *       accessToken: process.env.TWITTER_ACCESS_TOKEN!,
 *       accessSecret: process.env.TWITTER_ACCESS_SECRET!,
 *     });
 *   }
 *
 *   async sendMessage(options: SendMessageOptions) {
 *     // Send DM or tweet
 *     await this.client.v2.sendDm({
 *       dm_conversation_id: options.chatId,
 *       text: options.content,
 *     });
 *   }
 *
 *   // ... implement other methods
 * }
 * ```
 */
export class TwitterAdapter extends PlatformAdapter {
  platformType = PlatformType.TWITTER;

  async initialize(): Promise<void> {
    throw new Error('Twitter adapter not yet implemented. See comments in file for implementation guide.');
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
