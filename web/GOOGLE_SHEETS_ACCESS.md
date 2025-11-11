# How to Give Service Account Access to Google Sheets

## Quick Steps

### 1. Get Your Service Account Email

Your service account email is:
```
googlesheets-for-tgc@tgc-01.iam.gserviceaccount.com
```

You can also find it in:
- Vercel Dashboard → Your Project → Settings → Environment Variables → `GOOGLE_SHEETS_CREDENTIALS`
- Look for the `client_email` field in the JSON

### 2. Open Your Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Open the spreadsheet with ID: `16ltmW_dL...` (your `GOOGLE_SHEET_ID`)
3. Or search for "Wedding Order Sheet" in Google Drive

### 3. Share the Sheet with Service Account

1. **Click the "Share" button** (top right corner of the Google Sheet)
2. **In the "Add people and groups" field**, paste:
   ```
   googlesheets-for-tgc@tgc-01.iam.gserviceaccount.com
   ```
3. **Set permission to "Editor"** (important - needs write access)
4. **Uncheck "Notify people"** (service accounts don't have email)
5. **Click "Share"**

### 4. Verify Access

After sharing, the service account should appear in the "Shared with" list.

## Alternative: Check Current Access

### Method 1: Check Share Settings

1. Open your Google Sheet
2. Click "Share" button
3. Look in the "People with access" section
4. Check if `googlesheets-for-tgc@tgc-01.iam.gserviceaccount.com` is listed

### Method 2: Test via API

After sharing, test again:
```bash
curl -X POST "https://gownconnoisseur.vercel.app/api?endpoint=test" \
  -H "Content-Type: application/json" \
  -d '{}'
```

Then try submitting:
```bash
curl -X POST "https://gownconnoisseur.vercel.app/api?endpoint=submitformdetails" \
  -H "Content-Type: application/json" \
  -d '{
    "bridename": "Test Bride",
    "emailfield": "test@example.com",
    "phonenum": "1234567890"
  }'
```

## Troubleshooting

### Error: "The email address you entered couldn't be found"

- ✅ This is normal! Service accounts don't have Gmail addresses
- ✅ Just click "Share" anyway - Google will accept it
- ✅ The service account will appear as "Service Account" in the share list

### Error: "Permission denied" after sharing

1. **Double-check the email address** - it must match exactly:
   ```
   googlesheets-for-tgc@tgc-01.iam.gserviceaccount.com
   ```
2. **Verify permission level** - must be "Editor" (not "Viewer")
3. **Wait a few seconds** - sometimes there's a small delay for permissions to propagate

### Error: "Spreadsheet not found"

1. **Verify GOOGLE_SHEET_ID** in Vercel:
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Check `GOOGLE_SHEET_ID` value
   - It should be the long string from the Google Sheets URL (between `/d/` and `/edit`)

2. **Get the correct Sheet ID**:
   - Open your Google Sheet
   - Look at the URL: `https://docs.google.com/spreadsheets/d/16ltmW_dL.../edit`
   - Copy the part between `/d/` and `/edit`
   - That's your Sheet ID

### Still Not Working?

1. **Check Vercel logs**:
   - Go to Vercel Dashboard → Your Project → Deployments
   - Click on latest deployment → Functions tab
   - Click on the function to see detailed error logs

2. **Verify credentials**:
   - Make sure `GOOGLE_SHEETS_CREDENTIALS` in Vercel is valid JSON
   - Check that it includes `client_email` and `private_key`

3. **Test locally**:
   ```bash
   cd web
   vercel dev
   ```
   Then test with the local URL

## Visual Guide

```
Google Sheet → Share Button (top right)
              ↓
         "Add people and groups"
              ↓
    Paste: googlesheets-for-tgc@tgc-01.iam.gserviceaccount.com
              ↓
         Set to "Editor"
              ↓
    Uncheck "Notify people"
              ↓
          Click "Share"
```

## Important Notes

- ✅ Service accounts don't receive email notifications
- ✅ Always uncheck "Notify people" when sharing with service accounts
- ✅ "Editor" permission is required (needs to write data)
- ✅ The service account email must match exactly (case-sensitive)
- ✅ Changes take effect immediately (no waiting period)

