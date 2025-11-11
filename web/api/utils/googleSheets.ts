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

  const auth = new JWT({
    email: credentials.client_email,
    key: credentials.private_key.replace(/\\n/g, '\n'),
    scopes: [
      'https://www.googleapis.com/auth/spreadsheets',
      'https://www.googleapis.com/auth/drive',
    ],
  });

  sheetsClient = google.sheets({ version: 'v4', auth });
  
  const spreadsheetId = process.env.GOOGLE_SHEET_ID || '';
  spreadsheet = await sheetsClient.spreadsheets.get({
    spreadsheetId,
  });

  return { client: sheetsClient, spreadsheet };
}

export async function getWorksheet(sheetName: string) {
  const { client } = await initGoogleSheets();
  const spreadsheetId = process.env.GOOGLE_SHEET_ID || '';

  // Get all sheets to find the one we need
  const sheets = await client.spreadsheets.get({
    spreadsheetId,
  });

  const sheet = sheets.data.sheets?.find(
    (s: any) => s.properties?.title === sheetName
  );

  if (!sheet) {
    throw new Error(`Sheet "${sheetName}" not found`);
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

export async function insertRow(sheetName: string, values: any[], insertAfterRow: number = 1): Promise<void> {
  const { client, spreadsheetId, sheetId } = await getWorksheet(sheetName);

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
  const endColumnLetter = String.fromCharCode(64 + values.length);
  const range = `${sheetName}!${columnLetter}${insertAfterRow + 1}:${endColumnLetter}${insertAfterRow + 1}`;

  await client.spreadsheets.values.update({
    spreadsheetId,
    range,
    valueInputOption: 'RAW',
    requestBody: {
      values: [values],
    },
  });
}

export async function updateRow(
  sheetName: string,
  rowIndex: number,
  values: any[]
): Promise<void> {
  const { client, spreadsheetId } = await getWorksheet(sheetName);
  const columnLetter = String.fromCharCode(64 + 1);
  const endColumnLetter = String.fromCharCode(64 + values.length);
  const range = `${sheetName}!${columnLetter}${rowIndex}:${endColumnLetter}${rowIndex}`;

  await client.spreadsheets.values.update({
    spreadsheetId,
    range,
    valueInputOption: 'RAW',
    requestBody: {
      values: [values],
    },
  });
}

