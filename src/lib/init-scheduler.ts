import { scheduleReminders } from './scheduler';

// This file is used to initialize the scheduler when the application starts
// It will be imported in the app/layout.tsx file

let schedulerInitialized = false;

export const initializeScheduler = () => {
  // Only initialize once
  if (schedulerInitialized) {
    return;
  }
  
  // Only run on the server
  if (typeof window === 'undefined') {
    try {
      // Initialize the scheduler
      scheduleReminders();
      schedulerInitialized = true;
      console.log('Reminder scheduler initialized');
    } catch (error) {
      console.error('Failed to initialize reminder scheduler:', error);
    }
  }
};
