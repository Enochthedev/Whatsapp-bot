import { PlatformAdapter, PlatformType } from './base';
import { WhatsAppAdapter } from './whatsapp/adapter';
import { DiscordAdapter } from './discord/adapter';
import { TwitterAdapter } from './twitter/adapter';

/**
 * Platform factory for creating platform adapters
 */
export class PlatformFactory {
  /**
   * Create a platform adapter based on type
   */
  static create(type: PlatformType): PlatformAdapter {
    switch (type) {
      case PlatformType.WHATSAPP:
        return new WhatsAppAdapter();

      case PlatformType.DISCORD:
        return new DiscordAdapter();

      case PlatformType.TWITTER:
        return new TwitterAdapter();

      default:
        throw new Error(`Unsupported platform type: ${type}`);
    }
  }

  /**
   * Get all available platforms
   */
  static getAvailablePlatforms(): PlatformType[] {
    return [PlatformType.WHATSAPP]; // Only WhatsApp is currently implemented
  }

  /**
   * Check if a platform is implemented
   */
  static isImplemented(type: PlatformType): boolean {
    return type === PlatformType.WHATSAPP;
  }
}

// Export for convenience
export { PlatformType, PlatformAdapter };
