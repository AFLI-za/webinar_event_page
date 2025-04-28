import { createEvents, EventAttributes } from 'ics';

// Event details
const EVENT_DATE = new Date("2025-05-20T14:00:00Z"); // May 20th, 2025 at 3pm WAT (West African Time is GMT+1)
const EVENT_END_DATE = new Date(EVENT_DATE.getTime() + 90 * 60 * 1000); // 90 minutes duration
const EVENT_TITLE = "REFLECTIONS ON THE AFRICA JOBS SCENARIOS REPORT";
const EVENT_DESCRIPTION = "DIALOGUE FOR ACTION:REFLECTIONS ON THE AFRICA JOBS SCENARIOS REPORT";
const EVENT_LOCATION = "Online";
const EVENT_URL = "https://teams.microsoft.com/l/meetup-join/19%3ameeting_M2Y2ODY5ZTktZWZkNi00NTEyLTg5MjYtYzY1MDQyYzJiODJj%40thread.v2/0?context=%7b%22Tid%22%3a%22a7b80bb5-0fc9-41e4-a178-f21263a11de7%22%2c%22Oid%22%3a%22b957d060-9e55-4de3-a3d3-7d5293b33905%22%7d"

/**
 * Generate an iCalendar file for the webinar event
 * @returns Promise with the iCalendar file content
 */
export const generateCalendarFile = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      // Format dates for iCalendar
      const startDate = [
        EVENT_DATE.getUTCFullYear(),
        EVENT_DATE.getUTCMonth() + 1, // Months are 0-indexed in JS
        EVENT_DATE.getUTCDate(),
        EVENT_DATE.getUTCHours(),
        EVENT_DATE.getUTCMinutes()
      ];

      const endDate = [
        EVENT_END_DATE.getUTCFullYear(),
        EVENT_END_DATE.getUTCMonth() + 1,
        EVENT_END_DATE.getUTCDate(),
        EVENT_END_DATE.getUTCHours(),
        EVENT_END_DATE.getUTCMinutes()
      ];

      // Create a simple iCalendar file manually as a fallback
      // This is more reliable than depending on the ics library
      const iCalContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//AFLI//AFRICA JOBS SCENARIOS REPORT//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:${Date.now()}@afli.org
SUMMARY:${EVENT_TITLE}
DTSTAMP:${formatICalDate(new Date())}
DTSTART:${formatICalDate(EVENT_DATE)}
DTEND:${formatICalDate(EVENT_END_DATE)}
DESCRIPTION:${EVENT_DESCRIPTION.replace(/\n/g, '\\n')}
LOCATION:${EVENT_LOCATION}
URL:${EVENT_URL}
STATUS:CONFIRMED
BEGIN:VALARM
ACTION:DISPLAY
DESCRIPTION:Reminder: Event starts in 1 hour
TRIGGER:-PT1H
END:VALARM
BEGIN:VALARM
ACTION:DISPLAY
DESCRIPTION:Reminder: Event starts tomorrow
TRIGGER:-P1D
END:VALARM
BEGIN:VALARM
ACTION:DISPLAY
DESCRIPTION:Reminder: Event starts in 1 week
TRIGGER:-P7D
END:VALARM
END:VEVENT
END:VCALENDAR`;

      resolve(iCalContent);
    } catch (error) {
      console.error('Error generating calendar file:', error);
      reject(error);
    }
  });
};

// Helper function to format date for iCalendar
function formatICalDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/g, '');
}

/**
 * Get event details for use in emails and UI
 */
export const getEventDetails = () => {
  return {
    title: EVENT_TITLE,
    date: EVENT_DATE,
    endDate: EVENT_END_DATE,
    description: EVENT_DESCRIPTION,
    location: EVENT_LOCATION,
    url: EVENT_URL,
    duration: '90 minutes'
  };
};
