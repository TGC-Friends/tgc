# How to Find Your Google Sheet ID

## Method 1: From Google Sheets URL (Easiest)

1. Open your Google Spreadsheet in a web browser
2. Look at the URL in the address bar
3. The URL will look like this:
   ```
   https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
   ```
4. The **Google Sheet ID** is the long string between `/d/` and `/edit`:
   ```
   1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms
   ```

## Method 2: From Google Drive

1. Go to [Google Drive](https://drive.google.com)
2. Find your spreadsheet: **"Wedding Order Sheet"**
3. Right-click on it → **Get link** or **Share**
4. The link will contain the Sheet ID in the same format

## Method 3: Check Existing Code

Based on your Django code, the spreadsheet is named:
- **"Wedding Order Sheet"**

You can search for this in Google Drive to find it.

## What to Do With It

Once you have the Sheet ID:

1. Go to Vercel dashboard → Your project → Settings → Environment Variables
2. Add a new variable:
   - **Key**: `GOOGLE_SHEET_ID`
   - **Value**: The Sheet ID (e.g., `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms`)
   - **Environments**: Select Production, Preview, and Development

## Important Notes

- The Sheet ID is **not** the full URL, just the ID part
- Make sure your service account email has **Editor** access to this spreadsheet
- The service account email is in your credentials JSON: `client_email` field
- Share the sheet with that email address in Google Sheets

## Verify Access

To verify your service account can access the sheet:

1. Open the Google Sheet
2. Click **Share** button
3. Add the service account email (from `GOOGLE_SHEETS_CREDENTIALS`)
4. Give it **Editor** permissions
5. Click **Send**

The service account email looks like:
```
googlesheets-for-tgc@tgc-01.iam.gserviceaccount.com
```
(Check your actual credentials JSON for the exact email)

