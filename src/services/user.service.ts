import prisma from '../database/prisma';
import { CONSTANTS } from '../config/constants';
import type { User } from '../types';

export class UserService {
  /**
   * Create a new user in the database
   */
  async createUser(phoneNumber: string, name?: string): Promise<User> {
    return (await prisma.user.create({
      data: {
        phoneNumber,
        name,
      },
    })) as User;
  }

  /**
   * Find user by phone number
   */
  async findByPhoneNumber(phoneNumber: string): Promise<User | null> {
    return (await prisma.user.findUnique({
      where: { phoneNumber },
    })) as User | null;
  }

  /**
   * Find or create a user
   */
  async findOrCreate(phoneNumber: string, name?: string): Promise<User> {
    const existingUser = await this.findByPhoneNumber(phoneNumber);

    if (existingUser) {
      return existingUser;
    }

    return await this.createUser(phoneNumber, name);
  }

  /**
   * Add a strike to a user
   */
  async addStrike(phoneNumber: string): Promise<{ user: User; shouldKick: boolean }> {
    const user = (await prisma.user.update({
      where: { phoneNumber },
      data: {
        numberOfStrikes: {
          increment: 1,
        },
      },
    })) as User;

    const shouldKick =
      CONSTANTS.STRIKES.AUTO_KICK_ON_MAX && user.numberOfStrikes >= CONSTANTS.STRIKES.MAX_STRIKES;

    return { user, shouldKick };
  }

  /**
   * Reset user strikes
   */
  async resetStrikes(phoneNumber: string): Promise<User> {
    return (await prisma.user.update({
      where: { phoneNumber },
      data: {
        numberOfStrikes: 0,
      },
    })) as User;
  }

  /**
   * Update user role
   */
  async updateRole(
    phoneNumber: string,
    role: { isAdmin?: boolean; isModerator?: boolean }
  ): Promise<User> {
    return (await prisma.user.update({
      where: { phoneNumber },
      data: role,
    })) as User;
  }

  /**
   * Get all users
   */
  async getAllUsers(): Promise<User[]> {
    return (await prisma.user.findMany()) as User[];
  }

  /**
   * Get users with strikes
   */
  async getUsersWithStrikes(): Promise<User[]> {
    return (await prisma.user.findMany({
      where: {
        numberOfStrikes: {
          gt: 0,
        },
      },
      orderBy: {
        numberOfStrikes: 'desc',
      },
    })) as User[];
  }

  /**
   * Delete user
   */
  async deleteUser(phoneNumber: string): Promise<User> {
    return (await prisma.user.delete({
      where: { phoneNumber },
    })) as User;
  }
}

// Export singleton instance
export const userService = new UserService();
