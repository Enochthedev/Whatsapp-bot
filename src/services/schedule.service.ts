import prisma from '../database/prisma';
import type { Schedule } from '../types';

export interface CreateScheduleInput {
  name: string;
  chatId: string;
  message: string;
  cronExpression: string;
  timezone?: string;
  isActive?: boolean;
}

export class ScheduleService {
  /**
   * Create a new schedule
   */
  async createSchedule(data: CreateScheduleInput): Promise<Schedule> {
    return (await prisma.schedule.create({
      data,
    })) as Schedule;
  }

  /**
   * Get all active schedules
   */
  async getActiveSchedules(): Promise<Schedule[]> {
    return (await prisma.schedule.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    })) as Schedule[];
  }

  /**
   * Get schedule by ID
   */
  async getScheduleById(id: string): Promise<Schedule | null> {
    return (await prisma.schedule.findUnique({
      where: { id },
    })) as Schedule | null;
  }

  /**
   * Update schedule
   */
  async updateSchedule(
    id: string,
    data: Partial<Omit<CreateScheduleInput, 'name'>>
  ): Promise<Schedule> {
    return (await prisma.schedule.update({
      where: { id },
      data,
    })) as Schedule;
  }

  /**
   * Toggle schedule active status
   */
  async toggleSchedule(id: string): Promise<Schedule> {
    const schedule = await this.getScheduleById(id);
    if (!schedule) {
      throw new Error('Schedule not found');
    }

    return (await prisma.schedule.update({
      where: { id },
      data: {
        isActive: !schedule.isActive,
      },
    })) as Schedule;
  }

  /**
   * Delete schedule
   */
  async deleteSchedule(id: string): Promise<Schedule> {
    return (await prisma.schedule.delete({
      where: { id },
    })) as Schedule;
  }

  /**
   * Seed default schedules
   */
  async seedDefaultSchedules(announcementChatId: string): Promise<void> {
    const defaultSchedules = [
      {
        name: 'Morning Reminder',
        chatId: announcementChatId,
        message:
          'Good morning! Time to get that pc up and running and commit your first line for the day …..or the year😴🔗',
        cronExpression: '0 8 * * *',
        timezone: 'Africa/Lagos',
      },
      {
        name: 'Midday Reminder',
        chatId: announcementChatId,
        message: 'Ring Ring ⏰ what time is it? Its Commit time 🗣',
        cronExpression: '0 12 * * *',
        timezone: 'Africa/Lagos',
      },
      {
        name: 'Evening Reminder',
        chatId: announcementChatId,
        message: 'Last lap Time for commit number 3',
        cronExpression: '0 18 * * *',
        timezone: 'Africa/Lagos',
      },
      {
        name: 'Night Reminder',
        chatId: announcementChatId,
        message:
          'Final commit of the day🥳 Time to push and shut-down for the day Cheers if you have made it this far to those who have lost their streaks its never too late to restart, And if you havent then there always tomorrow to start. It all starts with a git',
        cronExpression: '0 22 * * *',
        timezone: 'Africa/Lagos',
      },
    ];

    // Check if schedules already exist
    const existingSchedules = await this.getActiveSchedules();
    if (existingSchedules.length > 0) {
      console.log('Schedules already exist, skipping seeding');
      return;
    }

    // Create all schedules
    for (const schedule of defaultSchedules) {
      await this.createSchedule(schedule);
    }

    console.log(`✅ Seeded ${defaultSchedules.length} default schedules`);
  }
}

// Export singleton instance
export const scheduleService = new ScheduleService();
