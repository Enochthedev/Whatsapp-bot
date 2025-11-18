# WhatsApp Coffee Bot

A production-ready WhatsApp bot built with TypeScript, Prisma, and whatsapp-web.js for group management, automation, and moderation.

## Table of Contents
- [Features](#features)
- [Architecture](#architecture)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Commands](#commands)
- [Development](#development)
- [Database](#database)
- [Contributing](#contributing)
- [License](#license)

## Features

### Core Features
- **TypeScript** - Full type safety and modern JavaScript features
- **Prisma ORM** - Type-safe database access with MongoDB
- **Command System** - Modular, extensible command handler
- **Permission System** - Admin and moderator role-based access control
- **User Management** - Track users with strike system
- **Automated Messaging** - Cron-based scheduled messages
- **Session Persistence** - MongoDB-backed WhatsApp session storage

### Command Categories
- **Basic Commands** - Ping, help, greetings, tag all members
- **Advanced Commands** - User reporting, strike management
- **Moderator Commands** - Kick, ban, and moderation tools

### Automation
- Scheduled reminders for git commits (configurable via database)
- Custom message scheduling with cron expressions
- Timezone-aware scheduling

## Architecture

```
src/
├── index.ts                    # Application entry point
├── config/                     # Configuration
│   ├── environment.ts          # Environment validation (Zod)
│   └── constants.ts            # App constants
├── database/
│   └── prisma.ts               # Prisma client singleton
├── services/                   # Business logic
│   ├── user.service.ts         # User operations
│   └── schedule.service.ts     # Schedule management
├── commands/                   # Command system
│   ├── types.ts                # Command types
│   ├── handler.ts              # Command handler
│   ├── basic/                  # Basic commands
│   ├── advanced/               # Advanced commands
│   └── moderator/              # Moderator commands
├── middleware/
│   └── permissions.ts          # Permission checks
├── utils/
│   └── chat.utils.ts           # Utility functions
└── automation/
    └── scheduler.ts            # Automation scheduler
```

## Installation

### Prerequisites
- Node.js 18+
- MongoDB database
- WhatsApp account for bot

### Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd Whatsapp-bot
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
cp .env.sample .env
```

Edit `.env` with your configuration:
```env
MONGODB_URI=mongodb://localhost:27017/whatsapp-bot
BOT_NAME=Coffee Bot
TIMEZONE=Africa/Lagos
NODE_ENV=development
ANNOUNCEMENT_CHAT_NAME=Announcements
```

4. **Generate Prisma client**
```bash
npm run prisma:generate
```

5. **Run database migrations** (if using Prisma Migrate)
```bash
npm run prisma:migrate
```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | Required |
| `BOT_NAME` | Name of the bot | Coffee Bot |
| `TIMEZONE` | Timezone for schedules | Africa/Lagos |
| `NODE_ENV` | Environment mode | development |
| `ANNOUNCEMENT_CHAT_NAME` | Chat name for announcements | Announcements |

### Strike System

Configure in `src/config/constants.ts`:
- `MAX_STRIKES`: Maximum strikes before auto-kick (default: 3)
- `AUTO_KICK_ON_MAX`: Enable/disable auto-kick (default: true)

## Usage

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
# Build TypeScript
npm run build

# Start production server
npm start
```

### First Run
1. Run the bot with `npm run dev`
2. Scan the QR code with WhatsApp
3. Add the bot to your announcement group
4. Restart the bot to initialize automation

## Commands

### Basic Commands
- `/ping` - Test bot responsiveness
- `/helloworld` - Get a greeting
- `/admin` - List group administrators
- `/commands` or `/help` - List all commands
- `/tagall` - Tag all group members (admin only)
- `/greet` - Get a random Nigerian greeting
- `/copyme <message>` - Bot copies your message

### Advanced Commands
- `/report @username` - Report user (adds strike, moderator only)
- `/strikes [@username]` - Check strikes for yourself or another user
- `/resetstrikes @username` - Reset user strikes (moderator only)

### Moderator Commands
- `/kick @username` - Remove user from group
- `/ban @username` - Ban user from group

## Development

### Project Structure
- **Commands**: Add new commands in `src/commands/[category]/`
- **Services**: Business logic in `src/services/`
- **Database**: Prisma schema in `prisma/schema.prisma`

### Adding a New Command

1. Create command in appropriate category file:
```typescript
export const myCommand: Command = {
  name: 'mycommand',
  description: 'My command description',
  category: 'basic',
  handler: async ({ message, args }) => {
    await message.reply('Hello!');
  },
};
```

2. Add to exports array in the same file
3. Command will be automatically registered

### Database Operations

```bash
# Generate Prisma client
npm run prisma:generate

# Create migration
npm run prisma:migrate

# Open Prisma Studio
npm run prisma:studio
```

### Code Quality

```bash
# Lint code
npm run lint

# Format code
npm run format
```

## Database

### Schema

**User Model**
- Phone number (unique)
- Name
- Strike count
- Admin/Moderator flags
- Timestamps

**Schedule Model**
- Name, chat ID, message
- Cron expression, timezone
- Active status
- Timestamps

**Command Model** (Future)
- Track command usage and stats

### Prisma Studio
Access the database GUI:
```bash
npm run prisma:studio
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- Use TypeScript strict mode
- Follow ESLint rules
- Use Prettier for formatting
- Add JSDoc comments for public APIs

## License

This project is licensed under the ISC License.
