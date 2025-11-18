import { Message } from 'whatsapp-web.js';

export interface CommandContext {
  message: Message;
  args: string[];
  commandName: string;
}

export type CommandHandler = (context: CommandContext) => Promise<void>;

export interface Command {
  name: string;
  description: string;
  category: 'basic' | 'advanced' | 'moderator' | 'admin';
  handler: CommandHandler;
  aliases?: string[];
  requiresGroup?: boolean;
  requiresAdmin?: boolean;
  requiresModerator?: boolean;
}

export interface CommandRegistry {
  [key: string]: Command;
}
