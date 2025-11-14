import { google } from 'googleapis';
import { JWT } from 'google-auth-library';

let sheetsClient: any = null;
let spreadsheet: any = null;

export async function initGoogleSheets() {
  if (sheetsClient) {
    return { client: sheetsClient, spreadsheet };
  }

  const credentials = JSON.parse(
    process.env.GOOGLE_SHEETS_CREDENTIALS || '{}'
  );

  if (!credentials.client_email || !credentials.private_key) {
    throw new Error('Google Sheets credentials not configured');
  }

  const spreadsheetId = process.env.GOOGLE_SHEET_ID || '';
  if (!spreadsheetId) {
    throw new Error('GOOGLE_SHEET_ID environment variable is not set');
  }

  const auth = new JWT({
    email: credentials.client_email,
    key: credentials.private_key.replace(/\\n/g, '\n'),
    scopes: [
      'https://www.googleapis.com/auth/spreadsheets',
      'https://www.googleapis.com/auth/drive',
    ],
  });

  sheetsClient = google.sheets({ version: 'v4', auth });
  
  try {
    spreadsheet = await sheetsClient.spreadsheets.get({
      spreadsheetId,
    });
  } catch (error: any) {
    if (error.code === 404) {
      throw new Error(`Spreadsheet not found. Check that GOOGLE_SHEET_ID (${spreadsheetId.substring(0, 10)}...) is correct and the service account (${credentials.client_email}) has access to it.`);
    }
    throw new Error(`Failed to access Google Sheet: ${error.message}`);
  }

  return { client: sheetsClient, spreadsheet };
}

export async function getWorksheet(sheetName: string) {
  const { client } = await initGoogleSheets();
  const spreadsheetId = process.env.GOOGLE_SHEET_ID || '';

  // Get all sheets to find the one we need
  let sheets;
  try {
    sheets = await client.spreadsheets.get({
      spreadsheetId,
    });
  } catch (error: any) {
    if (error.code === 404) {
      throw new Error(`Spreadsheet not found. Check GOOGLE_SHEET_ID and service account permissions.`);
    }
    throw error;
  }

  const sheet = sheets.data.sheets?.find(
    (s: any) => s.properties?.title === sheetName
  );

  if (!sheet) {
    const availableSheets = sheets.data.sheets?.map((s: any) => s.properties?.title).join(', ') || 'none';
    throw new Error(`Worksheet "${sheetName}" not found in spreadsheet. Available sheets: ${availableSheets}`);
  }

  return { client, spreadsheetId, sheetName, sheetId: sheet.properties.sheetId };
}

export async function getColumnValues(
  sheetName: string,
  columnIndex: number,
  startRow: number = 1
): Promise<string[]> {
  const { client, spreadsheetId } = await getWorksheet(sheetName);
  const columnLetter = String.fromCharCode(64 + columnIndex); // A=1, B=2, etc.

  const range = `${sheetName}!${columnLetter}${startRow}:${columnLetter}`;
  const response = await client.spreadsheets.values.get({
    spreadsheetId,
    range,
  });

  return (response.data.values || []).map((row: any[]) => String(row[0] || ''));
}

export async function findRowByValue(
  sheetName: string,
  columnIndex: number,
  searchValue: string
): Promise<number | null> {
  const values = await getColumnValues(sheetName, columnIndex);
  const index = values.findIndex((v) => v.includes(searchValue));
  return index >= 0 ? index + 1 : null; // +1 because sheets are 1-indexed
}

export async function getRowValues(sheetName: string, rowIndex: number): Promise<any[]> {
  const { client, spreadsheetId } = await getWorksheet(sheetName);
  const range = `${sheetName}!${rowIndex}:${rowIndex}`;
  
  const response = await client.spreadsheets.values.get({
    spreadsheetId,
    range,
  });

  return response.data.values?.[0] || [];
}

export async function updateCell(
  sheetName: string,
  rowIndex: number,
  columnIndex: number,
  value: any
): Promise<void> {
  const { client, spreadsheetId } = await getWorksheet(sheetName);
  const columnLetter = String.fromCharCode(64 + columnIndex);
  const range = `${sheetName}!${columnLetter}${rowIndex}`;

  await client.spreadsheets.values.update({
    spreadsheetId,
    range,
    valueInputOption: 'RAW',
    requestBody: {
      values: [[value]],
    },
  });
}

/**
 * Converts a date string to a format Google Sheets recognizes as a date
 * Supports formats like "dd MMM yy", "YYYY-MM-DD", "MM/DD/YYYY", etc.
 */
function formatDateForSheets(dateString: string): string | null {
  if (!dateString || dateString.trim() === '') {
    return null;
  }

  try {
    // Try to parse various date formats
    let date: Date;
    
    // Try "dd MMM yy" format (e.g., "15 Nov 25")
    const shortDateMatch = dateString.match(/^(\d{1,2})\s+([A-Za-z]{3})\s+(\d{2})$/);
    if (shortDateMatch) {
      const [, day, month, year] = shortDateMatch;
      const monthMap: { [key: string]: string } = {
        'jan': '01', 'feb': '02', 'mar': '03', 'apr': '04',
        'may': '05', 'jun': '06', 'jul': '07', 'aug': '08',
        'sep': '09', 'oct': '10', 'nov': '11', 'dec': '12'
      };
      const monthNum = monthMap[month.toLowerCase()];
      const fullYear = parseInt(year) < 50 ? `20${year}` : `19${year}`;
      date = new Date(`${fullYear}-${monthNum}-${day.padStart(2, '0')}`);
    } else {
      // Try parsing as ISO date or other formats
      date = new Date(dateString);
    }

    if (isNaN(date.getTime())) {
      return null;
    }

    // Format as YYYY-MM-DD (Google Sheets recognizes this as a date)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch (error) {
    console.warn(`Failed to parse date: ${dateString}`, error);
    return null;
  }
}

export async function insertRow(
  sheetName: string, 
  values: any[], 
  insertAfterRow: number = 1,
  dateColumnIndices: number[] = []
): Promise<void> {
  const { client, spreadsheetId, sheetId } = await getWorksheet(sheetName);

  // Format dates in the values array
  const formattedValues = values.map((value, index) => {
    if (dateColumnIndices.includes(index + 1)) { // +1 because columns are 1-indexed
      const formatted = formatDateForSheets(value);
      return formatted !== null ? formatted : value;
    }
    return value;
  });

  // Insert a new row
  await client.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [
        {
          insertDimension: {
            range: {
              sheetId,
              dimension: 'ROWS',
              startIndex: insertAfterRow,
              endIndex: insertAfterRow + 1,
            },
          },
        },
      ],
    },
  });

  // Add values to the new row
  const columnLetter = String.fromCharCode(64 + 1);
  const endColumnLetter = String.fromCharCode(64 + formattedValues.length);
  const range = `${sheetName}!${columnLetter}${insertAfterRow + 1}:${endColumnLetter}${insertAfterRow + 1}`;

  // Use USER_ENTERED so Google Sheets interprets dates properly
  await client.spreadsheets.values.update({
    spreadsheetId,
    range,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [formattedValues],
    },
  });

  // Set number format for date columns
  if (dateColumnIndices.length > 0) {
    const formatRequests = dateColumnIndices.map(colIndex => ({
      repeatCell: {
        range: {
          sheetId,
          startRowIndex: insertAfterRow,
          endRowIndex: insertAfterRow + 1,
          startColumnIndex: colIndex - 1, // Convert to 0-indexed
          endColumnIndex: colIndex,
        },
        cell: {
          userEnteredFormat: {
            numberFormat: {
              type: 'DATE',
              pattern: 'dd MMM yy',
            },
          },
        },
        fields: 'userEnteredFormat.numberFormat',
      },
    }));

    await client.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: formatRequests,
      },
    });
  }
}

export async function updateRow(
  sheetName: string,
  rowIndex: number,
  values: any[],
  dateColumnIndices: number[] = []
): Promise<void> {
  const { client, spreadsheetId, sheetId } = await getWorksheet(sheetName);
  
  // Format dates in the values array
  const formattedValues = values.map((value, index) => {
    if (dateColumnIndices.includes(index + 1)) { // +1 because columns are 1-indexed
      const formatted = formatDateForSheets(value);
      return formatted !== null ? formatted : value;
    }
    return value;
  });

  const columnLetter = String.fromCharCode(64 + 1);
  const endColumnLetter = String.fromCharCode(64 + formattedValues.length);
  const range = `${sheetName}!${columnLetter}${rowIndex}:${endColumnLetter}${rowIndex}`;

  // Use USER_ENTERED so Google Sheets interprets dates properly
  await client.spreadsheets.values.update({
    spreadsheetId,
    range,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [formattedValues],
    },
  });

  // Set number format for date columns
  if (dateColumnIndices.length > 0) {
    const formatRequests = dateColumnIndices.map(colIndex => ({
      repeatCell: {
        range: {
          sheetId,
          startRowIndex: rowIndex - 1, // Convert to 0-indexed
          endRowIndex: rowIndex,
          startColumnIndex: colIndex - 1, // Convert to 0-indexed
          endColumnIndex: colIndex,
        },
        cell: {
          userEnteredFormat: {
            numberFormat: {
              type: 'DATE',
              pattern: 'dd MMM yy',
            },
          },
        },
        fields: 'userEnteredFormat.numberFormat',
      },
    }));

    await client.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: formatRequests,
      },
    });
  }
}

