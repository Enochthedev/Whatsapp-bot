import { Client, Message, RemoteAuth } from 'whatsapp-web.js';
import { MongoStore } from 'wwebjs-mongo';
import mongoose from 'mongoose';
import qrcode from 'qrcode-terminal';
import {
  PlatformAdapter,
  PlatformType,
  PlatformMessage,
  PlatformUser,
  PlatformChat,
  PlatformParticipant,
  SendMessageOptions,
} from '../base';
import { CONSTANTS } from '../../config/constants';

export class WhatsAppAdapter extends PlatformAdapter {
  platformType = PlatformType.WHATSAPP;
  private client!: Client;
  private messageHandlers: Array<(message: PlatformMessage) => Promise<void>> = [];

  async initialize(): Promise<void> {
    console.log('🔌 Initializing WhatsApp adapter...');

    // Initialize MongoDB store for session
    const store = new MongoStore({ mongoose: mongoose });

    // Create WhatsApp client
    this.client = new Client({
      authStrategy: new RemoteAuth({
        store: store,
        backupSyncIntervalMs: CONSTANTS.BOT.SESSION_BACKUP_INTERVAL,
      }),
    });

    // Setup event handlers
    this.setupEventHandlers();

    // Initialize client
    await this.client.initialize();
  }

  private setupEventHandlers(): void {
    this.client.on('qr', (qr) => {
      console.log('\n📱 Scan this QR code with WhatsApp:');
      qrcode.generate(qr, { small: true });
    });

    this.client.on('authenticated', () => {
      console.log('✅ WhatsApp authenticated');
    });

    this.client.on('auth_failure', (msg) => {
      console.error('❌ WhatsApp authentication failure:', msg);
    });

    this.client.on('remote_session_saved', () => {
      console.log('💾 WhatsApp session saved');
    });

    this.client.on('ready', () => {
      console.log('🚀 WhatsApp client ready!');
    });

    this.client.on('disconnected', (reason) => {
      console.log('⚠️ WhatsApp disconnected:', reason);
    });

    // Message handler
    this.client.on('message', async (msg: Message) => {
      const platformMessage = await this.convertToPlatformMessage(msg);
      for (const handler of this.messageHandlers) {
        await handler(platformMessage);
      }
    });
  }

  private async convertToPlatformMessage(msg: Message): Promise<PlatformMessage> {
    const contact = await msg.getContact();
    const chat = await msg.getChat();

    return {
      id: msg.id._serialized,
      content: msg.body,
      author: {
        id: contact.id._serialized,
        username: contact.number,
        displayName: contact.pushname || contact.name || contact.number,
        phoneNumber: contact.number,
        isBot: contact.isMe,
      },
      chatId: chat.id._serialized,
      timestamp: new Date(msg.timestamp * 1000),
      isGroupChat: chat.isGroup,
      hasQuotedMessage: msg.hasQuotedMsg,
    };
  }

  async sendMessage(options: SendMessageOptions): Promise<void> {
    await this.client.sendMessage(options.chatId, options.content);
  }

  async replyToMessage(messageId: string, content: string): Promise<void> {
    const message = await this.client.getMessageById(messageId);
    if (message) {
      await message.reply(content);
    }
  }

  async getChat(chatId: string): Promise<PlatformChat> {
    const chat: any = await this.client.getChatById(chatId);

    return {
      id: chat.id._serialized,
      name: chat.name,
      isGroup: chat.isGroup,
      participants: chat.isGroup ? await this.getParticipants(chatId) : [],
    };
  }

  async getUser(userId: string): Promise<PlatformUser> {
    const contact = await this.client.getContactById(userId);

    return {
      id: contact.id._serialized,
      username: contact.number,
      displayName: contact.pushname || contact.name || contact.number,
      phoneNumber: contact.number,
      isBot: contact.isMe,
    };
  }

  async isUserAdmin(chatId: string, userId: string): Promise<boolean> {
    const chat: any = await this.client.getChatById(chatId);

    if (!chat.isGroup) {
      return false;
    }

    const admins = chat.participants.filter((p: any) => p.isAdmin || p.isSuperAdmin);
    return admins.some((admin: any) => admin.id._serialized === userId);
  }

  async removeUser(chatId: string, userId: string): Promise<void> {
    const chat: any = await this.client.getChatById(chatId);

    if (chat.isGroup) {
      await chat.removeParticipants([userId]);
    }
  }

  async getParticipants(chatId: string): Promise<PlatformParticipant[]> {
    const chat: any = await this.client.getChatById(chatId);

    if (!chat.isGroup) {
      return [];
    }

    return chat.participants.map((p: any) => ({
      user: {
        id: p.id._serialized,
        username: p.id.user,
        phoneNumber: p.id.user,
      },
      isAdmin: p.isAdmin || p.isSuperAdmin,
      isModerator: p.isAdmin || p.isSuperAdmin,
    }));
  }

  async findChatByName(name: string): Promise<PlatformChat | null> {
    const chats = await this.client.getChats();
    const chat = chats.find((c) => c.name === name);

    if (!chat) {
      return null;
    }

    return this.getChat(chat.id._serialized);
  }

  onMessage(handler: (message: PlatformMessage) => Promise<void>): void {
    this.messageHandlers.push(handler);
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.destroy();
    }
  }

  // WhatsApp-specific helper
  getClient(): Client {
    return this.client;
  }
}
