/**
 * Platform abstraction layer for multi-platform bot support
 * Supports WhatsApp, Discord, Twitter, and other platforms
 */

export enum PlatformType {
  WHATSAPP = 'whatsapp',
  DISCORD = 'discord',
  TWITTER = 'twitter',
  TELEGRAM = 'telegram',
  SLACK = 'slack',
}

export interface PlatformUser {
  id: string;
  username?: string;
  displayName?: string;
  phoneNumber?: string;
  isBot?: boolean;
}

export interface PlatformMessage {
  id: string;
  content: string;
  author: PlatformUser;
  chatId: string;
  timestamp: Date;
  isGroupChat: boolean;
  hasQuotedMessage?: boolean;
  attachments?: PlatformAttachment[];
}

export interface PlatformAttachment {
  type: 'image' | 'video' | 'audio' | 'document';
  url?: string;
  data?: Buffer;
  filename?: string;
}

export interface PlatformChat {
  id: string;
  name?: string;
  isGroup: boolean;
  participants?: PlatformParticipant[];
}

export interface PlatformParticipant {
  user: PlatformUser;
  isAdmin: boolean;
  isModerator: boolean;
}

export interface SendMessageOptions {
  chatId: string;
  content: string;
  replyToMessageId?: string;
  mentions?: string[];
  attachments?: PlatformAttachment[];
}

/**
 * Abstract platform adapter interface
 * All platform implementations must implement this interface
 */
export abstract class PlatformAdapter {
  abstract platformType: PlatformType;

  /**
   * Initialize the platform connection
   */
  abstract initialize(): Promise<void>;

  /**
   * Send a message to a chat
   */
  abstract sendMessage(options: SendMessageOptions): Promise<void>;

  /**
   * Reply to a message
   */
  abstract replyToMessage(messageId: string, content: string): Promise<void>;

  /**
   * Get chat information
   */
  abstract getChat(chatId: string): Promise<PlatformChat>;

  /**
   * Get user information
   */
  abstract getUser(userId: string): Promise<PlatformUser>;

  /**
   * Check if user is admin in a chat
   */
  abstract isUserAdmin(chatId: string, userId: string): Promise<boolean>;

  /**
   * Kick/remove user from a chat
   */
  abstract removeUser(chatId: string, userId: string): Promise<void>;

  /**
   * Get all participants in a chat
   */
  abstract getParticipants(chatId: string): Promise<PlatformParticipant[]>;

  /**
   * Find a chat by name
   */
  abstract findChatByName(name: string): Promise<PlatformChat | null>;

  /**
   * Listen for incoming messages
   */
  abstract onMessage(handler: (message: PlatformMessage) => Promise<void>): void;

  /**
   * Cleanup and disconnect
   */
  abstract disconnect(): Promise<void>;
}
