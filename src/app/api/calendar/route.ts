import { NextRequest, NextResponse } from 'next/server';
import { generateCalendarFile } from '@/lib/calendar';

export async function GET(request: NextRequest) {
  try {
    // Generate the calendar file
    const calendarContent = await generateCalendarFile();

    // Return the calendar file as a download
    return new NextResponse(calendarContent, {
      headers: {
        'Content-Type': 'text/calendar',
        'Content-Disposition': 'attachment; filename="afli-africa-jobs-scenarios-report.ics"',
        'Cache-Control': 'no-store'
      }
    });
  } catch (error) {
    console.error('Calendar generation error:', error);

    // If there's an error, return a simple error page instead of JSON
    // This is more user-friendly when the link is clicked directly
    return new NextResponse(
      `<!DOCTYPE html>
      <html>
        <head>
          <title>Error Generating Calendar</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
            h1 { color: #971c61; }
            .error { background-color: #f8d7da; border: 1px solid #f5c6cb; padding: 15px; border-radius: 4px; }
            .button { display: inline-block; background-color: #971c61; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <h1>Calendar Download Failed</h1>
          <div class="error">
            <p>Sorry, we couldn't generate the calendar file. Please try again later.</p>
            <p>Error details: ${error instanceof Error ? error.message : 'Unknown error'}</p>
          </div>
          <a href="/" class="button">Return to Home</a>
        </body>
      </html>`,
      {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
        },
        status: 500
      }
    );
  }
}
