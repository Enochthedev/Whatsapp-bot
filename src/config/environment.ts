import { config } from 'dotenv';
import { z } from 'zod';

// Load environment variables
config();

// Define the schema for environment variables
const envSchema = z.object({
  MONGODB_URI: z.string().url('MONGODB_URI must be a valid URL'),
  BOT_NAME: z.string().min(1, 'BOT_NAME is required').default('Coffee Bot'),
  TIMEZONE: z.string().default('Africa/Lagos'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  ANNOUNCEMENT_CHAT_NAME: z.string().default('Announcements'),
});

// Validate and export environment variables
function validateEnv() {
  try {
    const parsed = envSchema.parse(process.env);
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

export type Environment = z.infer<typeof envSchema>;
