export const CONSTANTS = {
  // Bot configuration
  BOT: {
    COMMAND_PREFIX: '/',
    SESSION_BACKUP_INTERVAL: 300000, // 5 minutes
  },

  // Strike system
  STRIKES: {
    MAX_STRIKES: 3,
    AUTO_KICK_ON_MAX: true,
  },

  // Command categories
  COMMAND_CATEGORIES: {
    BASIC: 'basic',
    ADVANCED: 'advanced',
    MODERATOR: 'moderator',
    ADMIN: 'admin',
  },

  // Messages
  MESSAGES: {
    UNAUTHORIZED: 'You do not have permission to use this command.',
    ADMIN_ONLY: 'Only admins can use this command.',
    MODERATOR_ONLY: 'Only moderators can use this command.',
    ERROR_GENERIC: 'Something went wrong. Please try again later.',
    USER_NOT_FOUND: 'User not found in the database.',
    PARTICIPANT_NOT_FOUND: 'Participant not found in the group.',
  },

  // Nigerian greetings
  GREETINGS: [
    'How far boss!',
    'Agba dev na you o!',
    'Hello boss!',
    'Wetin dey happen?',
    'How body?',
    'Oga you do well!',
  ] as string[],
};
