import nodemailer from 'nodemailer';
import { generateCalendarFile, getEventDetails } from './calendar';

// Create a transporter object using Office365 SMTP
export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Common email styling
const emailStyles = {
  container: 'font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;',
  header: 'color: #333;',
  logoHeader: 'text-align: center; padding: 20px 0; border-bottom: 2px solid #f0f0f0; margin-bottom: 20px;',
  logo: 'max-width: 180px; height: auto;',
  button: 'display: inline-block; background-color: #971c61; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;',
  secondaryButton: 'display: inline-block; background-color: #f5f5f5; color: #333; padding: 10px 20px; text-decoration: none; border-radius: 4px; border: 1px solid #ddd; margin-left: 10px;',
  eventDetails: 'background-color: #f9f0f5; border-left: 4px solid #971c61; padding: 15px; margin: 20px 0;',
  eventTitle: 'font-size: 18px; font-weight: bold; margin-bottom: 10px; color: #971c61;',
  eventInfo: 'margin: 5px 0; color: #333;',
};

// Format date for display in emails
const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const formatTime = (): string => {
  // Always display time as 3:00 PM WAT
  return "3:00 PM WAT";
};

// Email template for confirmation
export const createConfirmationEmail = async (name: string, email: string) => {
  const pdfLink = process.env.PDF_LINK || ''
  const eventDetails = getEventDetails();
  const calendarUrl = `/api/calendar`;

  try {
    // Generate calendar file
    const calendarFile = await generateCalendarFile();

    return {
      from: process.env.FROM_EMAIL,
      to: email,
      subject: 'Thank You for Registering – Dialogue for Action: Reflections on the Africa Jobs Scenarios Report',
      html: `
        <div style="${emailStyles.container}">
          <div style="${emailStyles.logoHeader}">
            <img src="https://imgur.com/1VcJs4p.jpg" alt="AFLI Logo" style="${emailStyles.logo}" />
          </div>
          <h2 style="${emailStyles.header}">Thank you for registering!</h2>
          <p>Hello ${name},</p>
          <p>Thank you for registering for our upcoming webinar, Dialogue for Action: Reflections on the Africa Jobs Scenarios Report. Here are the details you need to join the session:</p>

          <div style="${emailStyles.eventDetails}">
            <div style="${emailStyles.eventTitle}">${eventDetails.title}</div>
            <div style="${emailStyles.eventInfo}"><strong>Date:</strong> ${formatDate(eventDetails.date)}</div>
            <div style="${emailStyles.eventInfo}"><strong>Time:</strong> ${formatTime()}</div>
            <div style="${emailStyles.eventInfo}"><strong>Duration:</strong> ${eventDetails.duration}</div>
            <div style="${emailStyles.eventInfo}"><strong>Event Link:</strong> <a href="${eventDetails.url}" style="color: #971c61;">${eventDetails.url}</a></div>
          </div>



          <p>As promised, here's your link to download the report:</p>
          <p>
            <a
              href="${pdfLink}"
              style="${emailStyles.button}"
            >
              Download Report
            </a>
          </p>



          <p><strong>Important:</strong> You will receive reminder emails:</p>
          <ul>
            <li>One week before the event</li>
            <li>One day before the event</li>
            <li>One hour before the event</li>
          </ul>

          <p>If you have any questions, please don't hesitate to contact us.</p>
          <p>Best regards,<br>The AFLI Events Team</p>
        </div>
      `,
      attachments: [
        {
          filename: 'afli-africa-jobs-scenarios-report.ics',
          content: calendarFile,
          contentType: 'text/calendar'
        }
      ]
    };
  } catch (error) {
    console.error('Error generating calendar file:', error);

    // Return email without calendar attachment if there's an error
    return {
      from: process.env.FROM_EMAIL,
      to: email,
      subject: "Thank You for Registering – Dialogue for Action: Reflections on the Africa Jobs Scenarios Report",
      html: `
        <div style="${emailStyles.container}">
          <div style="${emailStyles.logoHeader}">
            <img src="https://imgur.com/1VcJs4p.jpg" alt="AFLI Logo" style="${emailStyles.logo}" />
          </div>
          <h2 style="${emailStyles.header}">Thank you for registering!</h2>
          <p>Hello ${name},</p>
          <p>Thank you for registering for our upcoming webinar, Reflections on the Africa Jobs Scenarios Report. Here are the details you need to join the session:</p>

          <div style="${emailStyles.eventDetails}">
            <div style="${emailStyles.eventTitle}">${eventDetails.title}</div>
            <div style="${emailStyles.eventInfo}"><strong>Date:</strong> ${formatDate(eventDetails.date)}</div>
            <div style="${emailStyles.eventInfo}"><strong>Time:</strong> ${formatTime()}</div>
            <div style="${emailStyles.eventInfo}"><strong>Duration:</strong> ${eventDetails.duration}</div>
            <div style="${emailStyles.eventInfo}"><strong>Event Link:</strong> <a href="${eventDetails.url}" style="color: #971c61;">${eventDetails.url}</a></div>
          </div>

          <p>Add this event to your calendar so you don't miss it:</p>
          <p>
            <a
              href="${calendarUrl}"
              style="${emailStyles.button}"
            >
              Add to Calendar
            </a>
          </p>

          <p>As promised, here's your link to download the report:</p>
          <p>
            <a
              href="${pdfLink}"
              style="${emailStyles.button}"
            >
              Download Report
            </a>
          </p>



          <p>If you have any questions, please don't hesitate to contact us.</p>
          <p>Best regards,<br>The AFLI Events Team</p>
        </div>
      `
    };
  }
};

// Email template for 1-week reminder
export const createWeekReminderEmail = async (name: string, email: string) => {
  const eventDetails = getEventDetails();
  const flyerLink = process.env.FLYER_LINK || '';

  return {
    from: process.env.FROM_EMAIL,
    to: email,
    subject: '1 Week Reminder: Dialogue for Action: Reflections on the Africa Jobs Scenarios Report',
    html: `
      <div style="${emailStyles.container}">
        <div style="${emailStyles.logoHeader}">
          <img src="https://imgur.com/1VcJs4p.jpg" alt="AFLI Logo" style="${emailStyles.logo}" />
        </div>
        <h2 style="${emailStyles.header}">Your webinar is in 1 week!</h2>
        <p>Hello ${name},</p>
        <p>This is a friendly reminder that the Reflections on the Africa Jobs Scenarios Report webinar is scheduled for next week.</p>

        <div style="${emailStyles.eventDetails}">
          <div style="${emailStyles.eventTitle}">${eventDetails.title}</div>
          <div style="${emailStyles.eventInfo}"><strong>Date:</strong> ${formatDate(eventDetails.date)}</div>
          <div style="${emailStyles.eventInfo}"><strong>Time:</strong> ${formatTime()}</div>
          <div style="${emailStyles.eventInfo}"><strong>Duration:</strong> ${eventDetails.duration}</div>
          <div style="${emailStyles.eventInfo}"><strong>Event Link:</strong> <a href="${eventDetails.url}" style="color: #971c61;">${eventDetails.url}</a></div>
        </div>

        <p>Download the event flyer for more information:</p>
        <p>
          <a
            href="${flyerLink}"
            style="${emailStyles.button}"
          >
            Download Event Flyer
          </a>
        </p>

        <p>We look forward to seeing you there!</p>
        <p>Best regards,<br>The AFLI Events Team</p>
      </div>
    `
  };
};

// Email template for 1-day reminder
export const createDayReminderEmail = async (name: string, email: string) => {
  const eventDetails = getEventDetails();
  const flyerLink = process.env.FLYER_LINK || '';

  return {
    from: process.env.FROM_EMAIL,
    to: email,
    subject: 'Tomorrow: Dialogue for Action: Reflections on the Africa Jobs Scenarios Report',
    html: `
      <div style="${emailStyles.container}">
        <div style="${emailStyles.logoHeader}">
          <img src="https://imgur.com/1VcJs4p.jpg" alt="AFLI Logo" style="${emailStyles.logo}" />
        </div>
        <h2 style="${emailStyles.header}">Your webinar is tomorrow!</h2>
        <p>Hello ${name},</p>
        <p>This is a friendly reminder that the Reflections on the Africa Jobs Scenarios Report webinar is scheduled for tomorrow.</p>

        <div style="${emailStyles.eventDetails}">
          <div style="${emailStyles.eventTitle}">${eventDetails.title}</div>
          <div style="${emailStyles.eventInfo}"><strong>Date:</strong> ${formatDate(eventDetails.date)}</div>
          <div style="${emailStyles.eventInfo}"><strong>Time:</strong> ${formatTime()}</div>
          <div style="${emailStyles.eventInfo}"><strong>Duration:</strong> ${eventDetails.duration}</div>
          <div style="${emailStyles.eventInfo}"><strong>Event Link:</strong> <a href="${eventDetails.url}" style="color: #971c61;">${eventDetails.url}</a></div>
        </div>

        <p>Download the event flyer for more information:</p>
        <p>
          <a
            href="${flyerLink}"
            style="${emailStyles.button}"
          >
            Download Event Flyer
          </a>
        </p>

        <p>We look forward to seeing you there!</p>
        <p>Best regards,<br>The AFLI Events Team</p>
      </div>
    `
  };
};

// Email template for 1-hour reminder
export const createHourReminderEmail = async (name: string, email: string) => {
  const eventDetails = getEventDetails();
  const joinLink = eventDetails.url;
  const flyerLink = process.env.FLYER_LINK || '';

  return {
    from: process.env.FROM_EMAIL,
    to: email,
    subject: 'See You In an Hour! - Dialogue for Action: Reflections on the Africa Jobs Scenarios Report',
    html: `
      <div style="${emailStyles.container}">
        <div style="${emailStyles.logoHeader}">
          <img src="https://imgur.com/1VcJs4p.jpg" alt="AFLI Logo" style="${emailStyles.logo}" />
        </div>
        <h2 style="${emailStyles.header}">Your webinar starts in 1 hour!</h2>
        <p>Hello ${name},</p>
        <p>The Reflections on the Africa Jobs Scenarios Report webinar will be starting in about an hour.</p>

        <div style="${emailStyles.eventDetails}">
          <div style="${emailStyles.eventTitle}">${eventDetails.title}</div>
          <div style="${emailStyles.eventInfo}"><strong>Date:</strong> ${formatDate(eventDetails.date)}</div>
          <div style="${emailStyles.eventInfo}"><strong>Time:</strong> ${formatTime()}</div>
          <div style="${emailStyles.eventInfo}"><strong>Duration:</strong> ${eventDetails.duration}</div>
          <div style="${emailStyles.eventInfo}"><strong>Event Link:</strong> <a href="${eventDetails.url}" style="color: #971c61;">${eventDetails.url}</a></div>
        </div>

        <p>Click the button below to join the webinar:</p>
        <p>
          <a
            href="${joinLink}"
            style="${emailStyles.button}"
          >
            Join Webinar
          </a>
        </p>

        <p>Download the event flyer for more information:</p>
        <p>
          <a
            href="${flyerLink}"
            style="${emailStyles.button}"
          >
            Download Event Flyer
          </a>
        </p>

        <p>We look forward to seeing you soon!</p>
        <p>Best regards,<br>The AFLI Events Team</p>
      </div>
    `
  };
};
