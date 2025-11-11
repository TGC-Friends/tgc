# Fixing Heroku Google Sheets Credentials Error

## The Problem

The error `invalid_grant: Invalid JWT Signature` occurs because:
1. The Google service account credentials file is missing or corrupted on Heroku
2. The credentials file path is incorrect
3. The service account key was regenerated but the old key is still deployed

## Solution 1: Re-upload Credentials to Heroku

1. **Get your service account key file** (`tgc-01-bc70985442c3.json`)
2. **Upload it to Heroku**:
   ```bash
   # Make sure the keys folder exists in your Heroku app
   heroku run mkdir -p /app/tgc/keys
   
   # Or use Heroku config vars instead (recommended)
   ```

## Solution 2: Use Environment Variables (Better Approach)

Instead of storing the JSON file, use Heroku config vars:

1. **Convert JSON to environment variable**:
   ```bash
   # Get the JSON content
   cat tgc/keys/tgc-01-bc70985442c3.json
   
   # Set it as a Heroku config var (escape quotes properly)
   heroku config:set GOOGLE_SHEETS_CREDENTIALS='{"type":"service_account",...}'
   ```

2. **Update `tgc/views.py`** to read from environment variable:
   ```python
   import os
   import json
   
   def initGS():
       scope = ['https://spreadsheets.google.com/feeds',
                'https://www.googleapis.com/auth/drive']
       
       # Try environment variable first
       if os.environ.get('GOOGLE_SHEETS_CREDENTIALS'):
           creds_json = json.loads(os.environ['GOOGLE_SHEETS_CREDENTIALS'])
           gs_credentials = ServiceAccountCredentials.from_json_keyfile_dict(creds_json, scope)
       else:
           # Fallback to file
           keysfolder = os.path.join(os.path.abspath(os.path.dirname(__file__)),'keys')
           googlesheetkeypath = keysfolder+"/tgc-01-bc70985442c3.json"
           gs_credentials = ServiceAccountCredentials.from_json_keyfile_name(googlesheetkeypath, scope)
       
       gc = gspread.authorize(gs_credentials)
       return gc
   ```

## Solution 3: Lazy Initialization (Prevent Startup Errors)

Modify `views.py` to initialize Google Sheets only when needed, not at module load:

```python
# Remove these lines from module level:
# gc = initGS(jsonfile=googlesheetkeypath)
# wos = gc.open("Wedding Order Sheet")

# Instead, initialize in functions:
def logtosheet(sheetname):
    try:
        gc = initGS(jsonfile=googlesheetkeypath)
        wos = gc.open("Wedding Order Sheet")
        sheet = wos.worksheet(sheetname)
        return sheet
    except Exception as e:
        print(f'Error initializing Google Sheets: {e}')
        raise
```

## Quick Fix: Regenerate Service Account Key

If the key is truly invalid:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to IAM & Admin → Service Accounts
3. Find your service account: `googlesheets-for-tgc@tgc-01.iam.gserviceaccount.com`
4. Create a new key (JSON format)
5. Download and update your local `tgc/keys/tgc-01-bc70985442c3.json`
6. Deploy to Heroku

## Recommended: Migrate to Vercel

Since you've already migrated to Vercel with serverless functions, you can:
- **Deprecate the Heroku app** (save costs)
- **Use only the Vercel deployment** (which handles credentials via environment variables)

The Vercel app is already set up correctly with environment variable-based credentials.

