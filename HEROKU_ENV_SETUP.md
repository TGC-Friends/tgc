# Setting Up Google Sheets Credentials on Heroku

## Quick Setup

After updating `views.py` to read from environment variables, set the Heroku config var:

```bash
# Get the JSON content and set it as a Heroku config var
heroku config:set GOOGLE_SHEETS_CREDENTIALS="$(cat tgc/keys/tgc-01-2025November.json | jq -c .)"
```

Or if you don't have `jq`:
```bash
# Read the file and escape it properly
heroku config:set GOOGLE_SHEETS_CREDENTIALS="$(cat tgc/keys/tgc-01-2025November.json)"
```

## Verify It's Set

```bash
heroku config:get GOOGLE_SHEETS_CREDENTIALS
```

## How It Works

The updated `initGS()` function now:

1. **First checks** for `GOOGLE_SHEETS_CREDENTIALS` environment variable (Heroku config var)
2. **Falls back** to file: `tgc/keys/tgc-01-2025November.json` if env var not set
3. **Uses lazy initialization** so the app won't crash on startup if credentials are missing

## Benefits

- ✅ More secure (credentials not in git)
- ✅ Easy to update (just change config var, no redeploy needed)
- ✅ Works with Heroku's 12-factor app principles
- ✅ Fallback to file for local development

## Local Development

For local development, you can either:

1. **Use the file** (default): Just make sure `tgc/keys/tgc-01-2025November.json` exists
2. **Use environment variable**: Set it in your local environment:
   ```bash
   export GOOGLE_SHEETS_CREDENTIALS="$(cat tgc/keys/tgc-01-2025November.json | jq -c .)"
   ```

## Troubleshooting

### "Error parsing GOOGLE_SHEETS_CREDENTIALS"
- Make sure the JSON is valid
- Check for escaped quotes: `heroku config:get GOOGLE_SHEETS_CREDENTIALS | jq .`
- Re-set it if needed

### "File not found" error
- Make sure `tgc/keys/tgc-01-2025November.json` exists locally
- The file doesn't need to be on Heroku if using env vars

### Still using old credentials
- Restart Heroku dyno: `heroku restart`
- Check logs: `heroku logs --tail`

