# Webinar Event Registration

A Next.js 14 application for webinar event registration with Supabase integration and email confirmation.

## Features

- Registration form with validation
- Supabase database integration
- Email confirmation using Nodemailer
- Admin panel to view registrations
- Responsive design with TailwindCSS
- Calendar download option (iCalendar format)
- Automated email reminders (1 week, 1 day, and 1 hour before the event)

## Prerequisites

- Node.js 18.x or higher
- Supabase account
- Office365 email account for SMTP

## Setup

1. Clone the repository:

```bash
git clone <repository-url>
cd webinar_event_page
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file in the root directory with the following variables:

```
# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key

# SMTP Configuration
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_USER=your_email@example.com
SMTP_PASS=your_email_password
FROM_EMAIL=your_email@example.com

# PDF Link and Event Flyer
PDF_LINK=https://example.com/report.pdf
FLYER_LINK=https://example.com/event-flyer.pdf

# Admin Configuration
ADMIN_PASSWORD=your_admin_password

# Site URL (for calendar and reminder links)
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Reminder API Key (for securing the reminder API)
REMINDER_API_KEY=your_reminder_api_key
```

4. Set up Supabase:
   - Create a new project in Supabase
   - Create a `registrations` table with the following columns:
     - `id` (UUID, Primary Key)
     - `name` (Text)
     - `email` (Text)
     - `created_at` (Timestamp with default: now())

   - **Note**: For the reminder functionality, you'll need to add these columns to your Supabase table:
     - `reminder_week_sent` (Boolean, default: false)
     - `reminder_day_sent` (Boolean, default: false)
     - `reminder_hour_sent` (Boolean, default: false)
     - `calendar_downloaded` (Boolean, default: false)

   - You can add these columns later through the Supabase dashboard:
     1. Go to your Supabase project
     2. Navigate to the "Table Editor" section
     3. Select the "registrations" table
     4. Click "Add Column" for each of the fields above
     5. Set the type to "boolean" and default value to "false"

5. Run the development server:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Pages

- `/` - Home page with information about the webinar
- `/register` - Registration form
- `/admin` - Admin panel to view all registrations (protected by password)

## API Routes

- `/api/register` - POST endpoint for form submissions
- `/api/admin` - POST endpoint for admin authentication and data retrieval
- `/api/calendar` - GET endpoint for downloading the event as an iCalendar file
- `/api/reminders` - POST endpoint for sending reminder emails

## Technologies Used

- Next.js 14 with App Router
- TypeScript
- Supabase for database
- Nodemailer for email sending
- React Hook Form for form handling
- Zod for validation
- TailwindCSS for styling
- ICS for generating iCalendar files
- Node-schedule for scheduling reminders
