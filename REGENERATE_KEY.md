# Regenerating Google Service Account Key via CLI

## Quick Method

Run the provided script:
```bash
./regenerate-service-account-key.sh
```

## Manual Method

If you prefer to run commands manually:

### 1. Authenticate (if not already)
```bash
gcloud auth login
```

### 2. Set the project
```bash
gcloud config set project tgc-01
```

### 3. List service accounts (to verify)
```bash
gcloud iam service-accounts list
```

You should see: `googlesheets-for-tgc@tgc-01.iam.gserviceaccount.com`

### 4. Create a new key
```bash
gcloud iam service-accounts keys create tgc/keys/tgc-01-bc70985442c3.json \
  --iam-account=googlesheets-for-tgc@tgc-01.iam.gserviceaccount.com \
  --project=tgc-01
```

This will:
- Create a new JSON key file
- Save it to `tgc/keys/tgc-01-bc70985442c3.json`
- The old key will still work until you delete it

### 5. Verify the key
```bash
cat tgc/keys/tgc-01-bc70985442c3.json | jq .client_email
```

Should output: `"googlesheets-for-tgc@tgc-01.iam.gserviceaccount.com"`

## After Regenerating

### Update Heroku (if still using it)

**Option A: Upload file via git**
```bash
git add tgc/keys/tgc-01-bc70985442c3.json
git commit -m "Update Google Sheets service account key"
git push heroku master
```

**Option B: Use environment variable (recommended)**
```bash
heroku config:set GOOGLE_SHEETS_CREDENTIALS="$(cat tgc/keys/tgc-01-bc70985442c3.json | jq -c .)"
```

### Update Vercel

1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Update `GOOGLE_SHEETS_CREDENTIALS` with the JSON content
4. You can get the JSON as a single line:
   ```bash
   cat tgc/keys/tgc-01-bc70985442c3.json | jq -c .
   ```
5. Paste it into the Vercel environment variable (escape quotes if needed)

### Delete Old Keys (Optional but Recommended)

After verifying the new key works, delete old keys:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to: IAM & Admin → Service Accounts
3. Click on `googlesheets-for-tgc@tgc-01.iam.gserviceaccount.com`
4. Go to the "Keys" tab
5. Delete old keys (keep only the active one)

Or via CLI:
```bash
# List keys
gcloud iam service-accounts keys list \
  --iam-account=googlesheets-for-tgc@tgc-01.iam.gserviceaccount.com

# Delete a specific key (replace KEY_ID with the actual key ID)
gcloud iam service-accounts keys delete KEY_ID \
  --iam-account=googlesheets-for-tgc@tgc-01.iam.gserviceaccount.com
```

## Troubleshooting

### "Permission denied" error
Make sure you have the `Service Account Key Admin` role:
```bash
gcloud projects get-iam-policy tgc-01
```

### "Service account not found"
Verify the service account exists:
```bash
gcloud iam service-accounts describe googlesheets-for-tgc@tgc-01.iam.gserviceaccount.com
```

### "Project not found"
Make sure you're using the correct project ID:
```bash
gcloud projects list
gcloud config set project tgc-01
```

