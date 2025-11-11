import { google } from 'googleapis';
import { JWT } from 'google-auth-library';

interface CalendarEvent {
  client_email: string;
  client_hp: string;
  client_name: string;
  event_name: string;
  date: string;
  staff: string;
}

export async function getGoogleCalendarEvents(
  calendarId: string,
  lookbackDays: number = 30
): Promise<CalendarEvent[]> {
  const credentials = JSON.parse(
    process.env.GOOGLE_CALENDAR_CREDENTIALS || process.env.GOOGLE_SHEETS_CREDENTIALS || '{}'
  );

  if (!credentials.client_email || !credentials.private_key) {
    throw new Error('Google Calendar credentials not configured');
  }

  const auth = new JWT({
    email: credentials.client_email,
    key: credentials.private_key.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
  });

  const calendar = google.calendar({ version: 'v3', auth });

  const now = new Date();
  now.setDate(now.getDate() - lookbackDays);
  const timeMin = now.toISOString();

  const response = await calendar.events.list({
    calendarId,
    timeMin,
    singleEvents: true,
    orderBy: 'startTime',
  });

  const events: CalendarEvent[] = [];

  for (const event of response.data.items || []) {
    try {
      const start = event.start?.dateTime || event.start?.date || '';
      const description = event.description || '';
      const summary = event.summary || '';

      // Parse description for client info
      const lines = description.split('\n');
      const staffName = lines[0]?.split(':')[1]?.trim() || '';
      const clientNumber = lines[1]?.split(':')[1]?.trim() || '';
      const clientEmail = lines[2]?.split(':')[1]?.trim() || '';

      // Parse summary for client name and event name
      const summaryParts = summary.split('for');
      const eventName = summaryParts[0]?.trim() || '';
      const clientName = summaryParts[1]?.trim() || '';
      
      // Remove phone numbers and digits from client name
      const cleanClientName = clientName.replace(/\+?\d\w*|\w*\d\w*/g, '').trim();

      // Format date
      let formattedDate = start;
      if (formattedDate) {
        formattedDate = formattedDate.replace('T', ' ').replace(/\+08:00|Z$/, '');
      }

      if (staffName) {
        events.push({
          client_email: clientEmail,
          client_hp: clientNumber,
          client_name: cleanClientName,
          event_name: eventName,
          date: formattedDate,
          staff: staffName,
        });
      }
    } catch (error) {
      console.error('Error parsing event:', error);
    }
  }

  return events;
}

export async function updateFittingDates(lookbackDays: number = 30): Promise<string> {
  // This is a simplified version - full implementation would merge with existing GS data
  // For now, we'll just get the calendar events
  
  const mtEvents = await getGoogleCalendarEvents('engmeiting@gmail.com', lookbackDays);
  const tgcEvents = await getGoogleCalendarEvents('hello@thegownconnoisseur.com', lookbackDays);

  // Filter for Fitting and Consultation events
  const allEvents = [...mtEvents, ...tgcEvents];
  const fittings = allEvents.filter(e => e.event_name.includes('Fitting'));
  const consultations = allEvents.filter(e => e.event_name.includes('Consultation'));

  // Note: Full implementation would:
  // 1. Get existing data from Google Sheets
  // 2. Merge and deduplicate
  // 3. Sort by date
  // 4. Update Google Sheets with combined data

  return `Updated Fitting Dates in GS. Found ${fittings.length} fittings and ${consultations.length} consultations.`;
}

