import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { transporter, createWeekReminderEmail, createDayReminderEmail, createHourReminderEmail } from '@/lib/email';
import { getEventDetails } from '@/lib/calendar';

// This API route is meant to be called by a scheduled job
// It will check which reminders need to be sent and send them
export async function POST(request: NextRequest) {
  try {
    // Verify API key for security (if this is called from an external scheduler)
    const { headers } = request;
    const apiKey = headers.get('x-api-key');

    if (apiKey !== process.env.REMINDER_API_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get event details
    const eventDetails = getEventDetails();
    const now = new Date();
    const eventDate = eventDetails.date;

    // Calculate time differences
    const oneWeekBefore = new Date(eventDate.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneDayBefore = new Date(eventDate.getTime() - 24 * 60 * 60 * 1000);
    const oneHourBefore = new Date(eventDate.getTime() - 60 * 60 * 1000);

    // Initialize counters for reporting
    let weekRemindersSent = 0;
    let dayRemindersSent = 0;
    let hourRemindersSent = 0;

    // Check if we need to send week reminders
    if (now >= oneWeekBefore && now < oneDayBefore) {
      try {
        // Get all registrations
        const { data: allRegistrations, error: regError } = await supabase
          .from('registration')
          .select('*');

        if (regError) {
          console.error('Supabase error (fetching registration):', regError);
        } else if (allRegistrations && allRegistrations.length > 0) {
          // Send week reminders to all registrations
          // In a production environment, you would check the reminder_week_sent field
          // but for now, we'll send to everyone since the column might not exist yet
          for (const registration of allRegistrations) {
            try {
              await transporter.sendMail(
                await createWeekReminderEmail(registration.name, registration.email)
              );

              // Note: We're not updating the reminder status since the column might not exist yet
              // In production, you would add this:
              // await supabase
              //   .from('registration')
              //   .update({ reminder_week_sent: true })
              //   .eq('id', registration.id);

              weekRemindersSent++;
            } catch (error) {
              console.error(`Failed to send week reminder to ${registration.email}:`, error);
            }
          }
        }
      } catch (error) {
        console.error('Error processing week reminders:', error);
      }
    }

    // Check if we need to send day reminders
    if (now >= oneDayBefore && now < oneHourBefore) {
      try {
        // Get all registrations
        const { data: allRegistrations, error: regError } = await supabase
          .from('registration')
          .select('*');

        if (regError) {
          console.error('Supabase error (fetching registration):', regError);
        } else if (allRegistrations && allRegistrations.length > 0) {
          // Send day reminders to all registrations
          for (const registration of allRegistrations) {
            try {
              await transporter.sendMail(
                await createDayReminderEmail(registration.name, registration.email)
              );

              // Note: We're not updating the reminder status since the column might not exist yet
              dayRemindersSent++;
            } catch (error) {
              console.error(`Failed to send day reminder to ${registration.email}:`, error);
            }
          }
        }
      } catch (error) {
        console.error('Error processing day reminders:', error);
      }
    }

    // Check if we need to send hour reminders
    if (now >= oneHourBefore && now < eventDate) {
      try {
        // Get all registrations
        const { data: allRegistrations, error: regError } = await supabase
          .from('registration')
          .select('*');

        if (regError) {
          console.error('Supabase error (fetching registration):', regError);
        } else if (allRegistrations && allRegistrations.length > 0) {
          // Send hour reminders to all registrations
          for (const registration of allRegistrations) {
            try {
              await transporter.sendMail(
                await createHourReminderEmail(registration.name, registration.email)
              );

              // Note: We're not updating the reminder status since the column might not exist yet
              hourRemindersSent++;
            } catch (error) {
              console.error(`Failed to send hour reminder to ${registration.email}:`, error);
            }
          }
        }
      } catch (error) {
        console.error('Error processing hour reminders:', error);
      }
    }

    // Return summary of reminders sent
    return NextResponse.json({
      success: true,
      reminders_sent: {
        week: weekRemindersSent,
        day: dayRemindersSent,
        hour: hourRemindersSent
      }
    });

  } catch (error) {
    console.error('Reminder processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process reminders' },
      { status: 500 }
    );
  }
}
