import * as cron from 'node-cron';
import { Client } from 'whatsapp-web.js';
import { scheduleService } from '../services/schedule.service';
import type { Schedule } from '../types';

interface ScheduledTask {
  schedule: Schedule;
  task: cron.ScheduledTask;
}

export class AutomationScheduler {
  private client: Client;
  private scheduledTasks: Map<string, ScheduledTask> = new Map();

  constructor(client: Client) {
    this.client = client;
  }

  /**
   * Initialize and start all active schedules from database
   */
  async initializeSchedules(): Promise<void> {
    try {
      const schedules = await scheduleService.getActiveSchedules();

      console.log(`📅 Initializing ${schedules.length} schedules...`);

      for (const schedule of schedules) {
        this.scheduleMessage(schedule);
      }

      console.log(`✅ All schedules initialized successfully`);
    } catch (error) {
      console.error('Error initializing schedules:', error);
    }
  }

  /**
   * Schedule a single message
   */
  scheduleMessage(schedule: Schedule): void {
    try {
      // Validate cron expression
      if (!cron.validate(schedule.cronExpression)) {
        console.error(`Invalid cron expression for schedule "${schedule.name}": ${schedule.cronExpression}`);
        return;
      }

      // Create scheduled task
      const task = cron.schedule(
        schedule.cronExpression,
        async () => {
          try {
            await this.client.sendMessage(schedule.chatId, schedule.message);
            console.log(`📨 Sent scheduled message: "${schedule.name}" to ${schedule.chatId}`);
          } catch (error) {
            console.error(`Error sending scheduled message "${schedule.name}":`, error);
          }
        },
        {
          scheduled: true,
          timezone: schedule.timezone,
        }
      );

      // Store task reference
      this.scheduledTasks.set(schedule.id, { schedule, task });

      console.log(
        `✅ Scheduled: "${schedule.name}" (${schedule.cronExpression} ${schedule.timezone})`
      );
    } catch (error) {
      console.error(`Error scheduling message "${schedule.name}":`, error);
    }
  }

  /**
   * Add a new schedule and start it
   */
  async addSchedule(scheduleData: {
    name: string;
    chatId: string;
    message: string;
    cronExpression: string;
    timezone?: string;
  }): Promise<void> {
    try {
      const schedule = await scheduleService.createSchedule(scheduleData);
      this.scheduleMessage(schedule);
      console.log(`✅ Added new schedule: "${schedule.name}"`);
    } catch (error) {
      console.error('Error adding schedule:', error);
      throw error;
    }
  }

  /**
   * Remove a schedule and stop its task
   */
  async removeSchedule(scheduleId: string): Promise<void> {
    try {
      const scheduledTask = this.scheduledTasks.get(scheduleId);

      if (scheduledTask) {
        scheduledTask.task.stop();
        this.scheduledTasks.delete(scheduleId);
      }

      await scheduleService.deleteSchedule(scheduleId);
      console.log(`✅ Removed schedule: ${scheduleId}`);
    } catch (error) {
      console.error('Error removing schedule:', error);
      throw error;
    }
  }

  /**
   * Stop a specific schedule
   */
  stopSchedule(scheduleId: string): void {
    const scheduledTask = this.scheduledTasks.get(scheduleId);

    if (scheduledTask) {
      scheduledTask.task.stop();
      console.log(`⏸️ Stopped schedule: "${scheduledTask.schedule.name}"`);
    }
  }

  /**
   * Start a specific schedule
   */
  startSchedule(scheduleId: string): void {
    const scheduledTask = this.scheduledTasks.get(scheduleId);

    if (scheduledTask) {
      scheduledTask.task.start();
      console.log(`▶️ Started schedule: "${scheduledTask.schedule.name}"`);
    }
  }

  /**
   * Stop all schedules
   */
  stopAll(): void {
    this.scheduledTasks.forEach((scheduledTask) => {
      scheduledTask.task.stop();
    });
    console.log('⏸️ All schedules stopped');
  }

  /**
   * Get all active schedules
   */
  getActiveSchedules(): ScheduledTask[] {
    return Array.from(this.scheduledTasks.values());
  }

  /**
   * Reload schedules from database
   */
  async reload(): Promise<void> {
    console.log('🔄 Reloading schedules...');
    this.stopAll();
    this.scheduledTasks.clear();
    await this.initializeSchedules();
  }
}
