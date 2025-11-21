import { config } from 'dotenv';
import { z } from 'zod';

// Load environment variables
config();

// Helper to parse boolean from string
const booleanString = z
  .string()
  .transform((val) => val.toLowerCase() === 'true')
  .default('false');

// Define the schema for environment variables
const envSchema = z.object({
  // Database
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),

  // General Bot Configuration
  BOT_NAME: z.string().min(1, 'BOT_NAME is required').default('Coffee Bot'),
  TIMEZONE: z.string().default('Africa/Lagos'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Platform Configuration
  WHATSAPP_ENABLED: booleanString.default('true'),
  DISCORD_ENABLED: booleanString.default('false'),
  TWITTER_ENABLED: booleanString.default('false'),

  // WhatsApp Configuration
  WHATSAPP_SESSION_BACKUP_INTERVAL: z.coerce.number().default(300000),

  // Discord Configuration (optional)
  DISCORD_TOKEN: z.string().optional(),
  DISCORD_CLIENT_ID: z.string().optional(),

  // Twitter Configuration (optional)
  TWITTER_API_KEY: z.string().optional(),
  TWITTER_API_SECRET: z.string().optional(),
  TWITTER_ACCESS_TOKEN: z.string().optional(),
  TWITTER_ACCESS_SECRET: z.string().optional(),

  // Announcement Channel Detection
  ANNOUNCEMENT_CHANNEL_KEYWORDS: z.string().default('announcement,updates,news,broadcast'),
  ANNOUNCEMENT_CHANNEL_FALLBACK: z.string().optional(),
});

// Validate and export environment variables
function validateEnv() {
  try {
    const parsed = envSchema.parse(process.env);

    // Validate platform-specific requirements
    if (parsed.DISCORD_ENABLED && !parsed.DISCORD_TOKEN) {
      console.warn('⚠️ Discord is enabled but DISCORD_TOKEN is not set');
    }

    if (parsed.TWITTER_ENABLED && !parsed.TWITTER_API_KEY) {
      console.warn('⚠️ Twitter is enabled but TWITTER_API_KEY is not set');
    }

    return parsed;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Invalid environment variables:');
      error.errors.forEach((err) => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`);
      });
      process.exit(1);
    }
    throw error;
  }
}

export const env = validateEnv();

// Helper to get announcement keywords as array
export function getAnnouncementKeywords(): string[] {
  return env.ANNOUNCEMENT_CHANNEL_KEYWORDS.split(',').map((k) => k.trim().toLowerCase());
}

export type Environment = z.infer<typeof envSchema>;
