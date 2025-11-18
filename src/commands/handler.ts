import { Message } from 'whatsapp-web.js';
import { Command, CommandRegistry, CommandContext } from './types';
import { CONSTANTS } from '../config/constants';
import { hasAdminPermissions, hasModPermissions } from '../middleware/permissions';

export class CommandHandler {
  private commands: CommandRegistry = {};

  /**
   * Register a command
   */
  registerCommand(command: Command): void {
    this.commands[command.name] = command;

    // Register aliases if any
    if (command.aliases) {
      command.aliases.forEach((alias) => {
        this.commands[alias] = command;
      });
    }

    console.log(`✅ Registered command: /${command.name}`);
  }

  /**
   * Register multiple commands
   */
  registerCommands(commands: Command[]): void {
    commands.forEach((command) => this.registerCommand(command));
  }

  /**
   * Get all registered commands
   */
  getCommands(): Command[] {
    // Remove duplicates (aliases point to same command)
    const uniqueCommands = new Map<string, Command>();
    Object.values(this.commands).forEach((cmd) => {
      uniqueCommands.set(cmd.name, cmd);
    });
    return Array.from(uniqueCommands.values());
  }

  /**
   * Get command by name
   */
  getCommand(name: string): Command | undefined {
    return this.commands[name];
  }

  /**
   * Handle incoming message
   */
  async handleMessage(message: Message): Promise<void> {
    try {
      // Check if message starts with command prefix
      if (!message.body.startsWith(CONSTANTS.BOT.COMMAND_PREFIX)) {
        return;
      }

      // Parse command and arguments
      const args = message.body.slice(CONSTANTS.BOT.COMMAND_PREFIX.length).trim().split(/\s+/);
      const commandName = args.shift()?.toLowerCase();

      if (!commandName) {
        return;
      }

      // Find command
      const command = this.getCommand(commandName);

      if (!command) {
        // Command not found - silently ignore
        return;
      }

      // Check if command requires group chat
      if (command.requiresGroup) {
        const chat = await message.getChat();
        if (!chat.isGroup) {
          await message.reply('This command can only be used in group chats.');
          return;
        }
      }

      // Check permissions
      if (command.requiresAdmin) {
        const hasPermission = await hasAdminPermissions(message);
        if (!hasPermission) {
          return; // hasAdminPermissions already sends error message
        }
      }

      if (command.requiresModerator) {
        const hasPermission = await hasModPermissions(message);
        if (!hasPermission) {
          return; // hasModPermissions already sends error message
        }
      }

      // Create context
      const context: CommandContext = {
        message,
        args,
        commandName: command.name,
      };

      // Execute command
      await command.handler(context);
    } catch (error) {
      console.error('Error handling command:', error);
      await message.reply(CONSTANTS.MESSAGES.ERROR_GENERIC);
    }
  }

  /**
   * Get commands by category
   */
  getCommandsByCategory(category: string): Command[] {
    return this.getCommands().filter((cmd) => cmd.category === category);
  }
}

// Export singleton instance
export const commandHandler = new CommandHandler();
