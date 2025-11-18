import qrcode from 'qrcode-terminal';
import { Client, RemoteAuth } from 'whatsapp-web.js';
import { MongoStore } from 'wwebjs-mongo';
import mongoose from 'mongoose';
import { env } from './config/environment';
import { CONSTANTS } from './config/constants';
import { commandHandler } from './commands/handler';
import { basicCommands } from './commands/basic';
import { advancedCommands } from './commands/advanced';
import { moderatorCommands } from './commands/moderator';
import { utilityCommands } from './commands/utility';
import { funCommands } from './commands/fun';
import { adminCommands } from './commands/admin';
import { AutomationScheduler } from './automation/scheduler';
import { getAnnouncementChatId } from './utils/chat.utils';
import { scheduleService } from './services/schedule.service';
import prisma from './database/prisma';

// Global client instance
let client: Client;
let scheduler: AutomationScheduler;

/**
 * Initialize the WhatsApp client
 */
async function initializeClient(): Promise<void> {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Test Prisma connection
    await prisma.$connect();
    console.log('✅ Connected to database via Prisma');

    // Initialize MongoDB store for session
    const store = new MongoStore({ mongoose: mongoose });

    // Create WhatsApp client
    client = new Client({
      authStrategy: new RemoteAuth({
        store: store,
        backupSyncIntervalMs: CONSTANTS.BOT.SESSION_BACKUP_INTERVAL,
      }),
    });

    console.log('✅ WhatsApp client created');

    // Register event handlers
    registerEventHandlers();

    // Register all commands
    registerCommands();

    // Initialize client
    await client.initialize();
  } catch (error) {
    console.error('❌ Error initializing client:', error);
    process.exit(1);
  }
}

/**
 * Register event handlers for the client
 */
function registerEventHandlers(): void {
  // QR Code generation
  client.on('qr', (qr) => {
    console.log('\n📱 Scan this QR code with WhatsApp:');
    qrcode.generate(qr, { small: true });
  });

  // Authentication success
  client.on('authenticated', () => {
    console.log('✅ Authentication successful');
  });

  // Authentication failure
  client.on('auth_failure', (msg) => {
    console.error('❌ Authentication failure:', msg);
  });

  // Session saved
  client.on('remote_session_saved', () => {
    console.log('💾 Session saved to remote store');
  });

  // Client ready
  client.on('ready', async () => {
    console.log('🚀 WhatsApp bot is ready!');
    console.log(`📛 Bot Name: ${env.BOT_NAME}`);
    console.log(`🌍 Timezone: ${env.TIMEZONE}`);
    console.log(`⚙️ Environment: ${env.NODE_ENV}`);

    // Initialize automation scheduler
    await initializeAutomation();
  });

  // Disconnection
  client.on('disconnected', (reason) => {
    console.log('⚠️ Client disconnected:', reason);
    if (scheduler) {
      scheduler.stopAll();
    }
  });

  // Message handler
  client.on('message', async (message) => {
    await commandHandler.handleMessage(message);
  });

  // Error handler
  client.on('error', (error) => {
    console.error('❌ Client error:', error);
  });
}

/**
 * Register all commands
 */
function registerCommands(): void {
  console.log('📝 Registering commands...');

  commandHandler.registerCommands([
    ...basicCommands,
    ...advancedCommands,
    ...moderatorCommands,
    ...utilityCommands,
    ...funCommands,
    ...adminCommands,
  ]);

  const allCommands = commandHandler.getCommands();
  console.log(`✅ Registered ${allCommands.length} commands`);
  console.log(
    `   - Basic: ${basicCommands.length + utilityCommands.length + funCommands.length}`
  );
  console.log(`   - Advanced: ${advancedCommands.length}`);
  console.log(`   - Moderator: ${moderatorCommands.length}`);
  console.log(`   - Admin: ${adminCommands.length}`);
}

/**
 * Initialize automation system
 */
async function initializeAutomation(): Promise<void> {
  try {
    console.log('⚙️ Initializing automation system...');

    // Get announcement chat ID
    const announcementChatId = await getAnnouncementChatId(client, env.ANNOUNCEMENT_CHAT_NAME);

    if (!announcementChatId) {
      console.warn(
        `⚠️ Announcement chat "${env.ANNOUNCEMENT_CHAT_NAME}" not found. Skipping automation setup.`
      );
      console.warn('   Add the bot to the announcement chat and restart to enable automation.');
      return;
    }

    // Seed default schedules if needed
    await scheduleService.seedDefaultSchedules(announcementChatId);

    // Initialize scheduler
    scheduler = new AutomationScheduler(client);
    await scheduler.initializeSchedules();

    console.log('✅ Automation system initialized');
  } catch (error) {
    console.error('❌ Error initializing automation:', error);
  }
}

/**
 * Graceful shutdown
 */
async function shutdown(): Promise<void> {
  console.log('\n⏹️ Shutting down gracefully...');

  try {
    if (scheduler) {
      scheduler.stopAll();
    }

    if (client) {
      await client.destroy();
    }

    await mongoose.disconnect();
    await prisma.$disconnect();

    console.log('✅ Shutdown complete');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
}

// Handle process termination
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  shutdown();
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  shutdown();
});

// Start the application
console.log('🤖 Starting WhatsApp Coffee Bot...');
console.log('═'.repeat(50));
initializeClient().catch((error) => {
  console.error('❌ Failed to start bot:', error);
  process.exit(1);
});

// Export client for testing or external use
export { client, scheduler };
