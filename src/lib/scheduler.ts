import schedule from 'node-schedule';
import { getEventDetails } from './calendar';

// Function to schedule reminders
export const scheduleReminders = () => {
  const eventDetails = getEventDetails();
  const eventDate = eventDetails.date;
  
  // Calculate reminder times
  const oneWeekBefore = new Date(eventDate.getTime() - 7 * 24 * 60 * 60 * 1000);
  const oneDayBefore = new Date(eventDate.getTime() - 24 * 60 * 60 * 1000);
  const oneHourBefore = new Date(eventDate.getTime() - 60 * 60 * 1000);
  
  // Schedule the reminders
  const now = new Date();
  
  // Only schedule if the time hasn't passed yet
  if (now < oneWeekBefore) {
    schedule.scheduleJob(oneWeekBefore, async () => {
      await triggerReminders();
    });
    console.log(`Week reminder scheduled for ${oneWeekBefore.toLocaleString()}`);
  }
  
  if (now < oneDayBefore) {
    schedule.scheduleJob(oneDayBefore, async () => {
      await triggerReminders();
    });
    console.log(`Day reminder scheduled for ${oneDayBefore.toLocaleString()}`);
  }
  
  if (now < oneHourBefore) {
    schedule.scheduleJob(oneHourBefore, async () => {
      await triggerReminders();
    });
    console.log(`Hour reminder scheduled for ${oneHourBefore.toLocaleString()}`);
  }
  
  // Also schedule a job to run every hour to catch any missed reminders
  // This is useful if the server was down during a scheduled reminder time
  const hourlyJob = schedule.scheduleJob('0 * * * *', async () => {
    await triggerReminders();
  });
  
  console.log('Hourly reminder check scheduled');
  
  return {
    stop: () => {
      schedule.gracefulShutdown();
    }
  };
};

// Function to trigger the reminder API
const triggerReminders = async () => {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/reminders`;
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.REMINDER_API_KEY || ''
      }
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      console.error('Failed to trigger reminders:', result);
      return;
    }
    
    console.log('Reminders triggered successfully:', result);
  } catch (error) {
    console.error('Error triggering reminders:', error);
  }
};
