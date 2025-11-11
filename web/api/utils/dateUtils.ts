import { parse, format } from 'date-fns';

export function formatEventDate(dateString: string): string {
  if (!dateString || dateString === '') {
    return '';
  }

  try {
    // Try parsing DD-MM-YYYY format first
    const parts = dateString.split('-');
    if (parts.length === 3 && parts[0].length === 2) {
      const date = parse(dateString, 'dd-MM-yyyy', new Date());
      return format(date, 'dd MMM yy');
    }
    
    // Try parsing other formats
    const date = parse(dateString, 'yyyy-MM-dd', new Date());
    return format(date, 'dd MMM yy');
  } catch (error) {
    // If parsing fails, try to parse as ISO string
    try {
      const date = new Date(dateString);
      return format(date, 'dd MMM yy');
    } catch {
      return dateString; // Return original if all parsing fails
    }
  }
}

export function processFormData(formData: any): any {
  const processed = { ...formData };

  // Format event dates
  if (processed.eventdate1) {
    processed.eventdate1 = formatEventDate(processed.eventdate1);
  }
  if (processed.eventdate2) {
    processed.eventdate2 = formatEventDate(processed.eventdate2);
  }
  if (processed.eventdate3) {
    processed.eventdate3 = formatEventDate(processed.eventdate3);
  }

  // Process checkbox arrays - remove 'false' values
  if (Array.isArray(processed.requiredoutfit)) {
    processed.requiredoutfit = processed.requiredoutfit
      .filter((v: any) => v !== 'false' && v !== false)
      .join(',');
  }
  if (Array.isArray(processed.preferredoutfit)) {
    processed.preferredoutfit = processed.preferredoutfit
      .filter((v: any) => v !== 'false' && v !== false)
      .join(',');
  }
  if (Array.isArray(processed.preferredstyle)) {
    processed.preferredstyle = processed.preferredstyle
      .filter((v: any) => v !== 'false' && v !== false)
      .join(',');
  }
  if (Array.isArray(processed.preferredNeckline)) {
    processed.preferredNeckline = processed.preferredNeckline
      .filter((v: any) => v !== 'false' && v !== false)
      .join(',');
  }

  return processed;
}

export function updateEventDict(
  eventDict: { weddingdate: string | null; PWS: string | null; ROMdate: string | null },
  responseData: any,
  eventNum: number
): { weddingdate: string | null; PWS: string | null; ROMdate: string | null } {
  const eventType = responseData[`eventtype${eventNum}`];
  const eventDate = responseData[`eventdate${eventNum}`];

  if (eventType === 'Actual' && eventDate) {
    eventDict.weddingdate = eventDate;
  } else if (eventType === 'PWS' && eventDate) {
    eventDict.PWS = eventDate;
  } else if (eventType === 'ROM' && eventDate) {
    eventDict.ROMdate = eventDate;
  }

  return eventDict;
}

