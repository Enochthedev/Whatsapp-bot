// Type definitions for database models (used before Prisma client is generated)

export interface User {
  id: string;
  phoneNumber: string;
  name?: string | null;
  numberOfStrikes: number;
  isAdmin: boolean;
  isModerator: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Schedule {
  id: string;
  name: string;
  chatId: string;
  message: string;
  cronExpression: string;
  timezone: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Command {
  id: string;
  name: string;
  description: string;
  category: string;
  isEnabled: boolean;
  usageCount: number;
  createdAt: Date;
  updatedAt: Date;
}
