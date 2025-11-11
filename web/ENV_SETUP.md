# Environment Variables Setup

This application requires several environment variables to be set for the backend API functions to work properly.

## Required Environment Variables

### Google Sheets Integration

1. **GOOGLE_SHEETS_CREDENTIALS** (JSON string)
   - Your Google Service Account credentials as a JSON string
   - This should be the entire JSON object from your service account key file
   - Example format:
   ```json
   {
     "type": "service_account",
     "project_id": "your-project-id",
     "private_key_id": "...",
     "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
     "client_email": "your-service-account@your-project.iam.gserviceaccount.com",
     ...
   }
   ```

2. **GOOGLE_SHEET_ID**
   - The ID of your Google Spreadsheet (found in the URL)
   - Example: `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms`

### Booqable API

3. **BOOQABLE_API_KEY**
   - Your Booqable API key
   - Found in your Booqable account settings

### Google Calendar (Optional - for fitting dates)

4. **GOOGLE_CALENDAR_CREDENTIALS** (JSON string)
   - Can use the same service account as Google Sheets if it has calendar access
   - Or a separate service account with calendar read permissions

## Setting Environment Variables

### For Local Development

Create a `.env.local` file in the `web` directory:

```bash
GOOGLE_SHEETS_CREDENTIALS='{"type":"service_account",...}'
GOOGLE_SHEET_ID=your-sheet-id
BOOQABLE_API_KEY=your-api-key
GOOGLE_CALENDAR_CREDENTIALS='{"type":"service_account",...}'
```

**Note:** For local development with Vercel CLI, you may need to use `vercel env pull` to get environment variables.

### For Vercel Deployment

1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add each variable:
   - **Key**: `GOOGLE_SHEETS_CREDENTIALS`
   - **Value**: Paste the entire JSON as a string (you may need to escape quotes)
   - **Environment**: Production, Preview, Development (select all)

4. Repeat for all required variables

**Important:** When pasting JSON in Vercel, you may need to:
- Escape double quotes: `\"`
- Or use single quotes around the JSON string
- Or use a tool to convert JSON to a single-line escaped string

## Getting Your Google Service Account Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google Sheets API and Google Calendar API
4. Go to "Credentials" → "Create Credentials" → "Service Account"
5. Create a service account and download the JSON key
6. Share your Google Sheet with the service account email (give Editor access)
7. Share your Google Calendar with the service account email (if using calendar features)

## Getting Your Booqable API Key

1. Log into your Booqable account
2. Go to Settings → API
3. Generate or copy your API key

## Security Notes

- **Never commit** `.env` files to git
- Keep your API keys secure
- Rotate keys if they're ever exposed
- Use different keys for development and production if possible

