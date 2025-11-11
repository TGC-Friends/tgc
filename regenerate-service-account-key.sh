#!/bin/bash

# Script to regenerate Google Sheets service account key via CLI
# Project: tgc-01
# Service Account: googlesheets-for-tgc@tgc-01.iam.gserviceaccount.com

PROJECT_ID="tgc-01"
SERVICE_ACCOUNT_EMAIL="googlesheets-for-tgc@tgc-01.iam.gserviceaccount.com"
OUTPUT_FILE="tgc/keys/tgc-01-bc70985442c3.json"

echo "Checking authentication..."
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
  echo "❌ Not authenticated. Please run: gcloud auth login"
  exit 1
fi

echo "✅ Authenticated as: $(gcloud auth list --filter=status:ACTIVE --format='value(account)')"
echo ""
echo "Setting project to $PROJECT_ID..."
gcloud config set project $PROJECT_ID

# Verify project access
if ! gcloud projects describe $PROJECT_ID &>/dev/null; then
  echo "❌ Cannot access project $PROJECT_ID. Make sure you have permissions."
  echo "   Available projects:"
  gcloud projects list --format="table(projectId,name)"
  exit 1
fi

echo ""
echo "Verifying service account exists..."
if ! gcloud iam service-accounts describe $SERVICE_ACCOUNT_EMAIL --project=$PROJECT_ID &>/dev/null; then
  echo "❌ Service account not found or no access: $SERVICE_ACCOUNT_EMAIL"
  echo ""
  echo "Available service accounts:"
  gcloud iam service-accounts list --project=$PROJECT_ID 2>/dev/null || echo "   (Cannot list - may need permissions)"
  exit 1
fi
echo "✅ Service account found: $SERVICE_ACCOUNT_EMAIL"

echo ""
echo "Creating new key for $SERVICE_ACCOUNT_EMAIL..."
echo "This will create a new key. The old key will remain valid until you delete it."
echo ""

# Create new key and save to file
gcloud iam service-accounts keys create $OUTPUT_FILE \
  --iam-account=$SERVICE_ACCOUNT_EMAIL \
  --project=$PROJECT_ID

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Success! New key saved to $OUTPUT_FILE"
  echo ""
  echo "⚠️  Important next steps:"
  echo "1. Update Heroku config var (if using):"
  echo "   heroku config:set GOOGLE_SHEETS_CREDENTIALS=\"\$(cat $OUTPUT_FILE)\""
  echo ""
  echo "2. Update Vercel environment variable:"
  echo "   - Go to Vercel project settings"
  echo "   - Add/update GOOGLE_SHEETS_CREDENTIALS with the JSON content"
  echo ""
  echo "3. (Optional) Delete old keys from Google Cloud Console"
  echo "   - Go to IAM & Admin → Service Accounts"
  echo "   - Click on the service account"
  echo "   - Go to 'Keys' tab and delete old keys"
else
  echo ""
  echo "❌ Error creating key. Make sure:"
  echo "   - You're authenticated: gcloud auth login"
  echo "   - You have permissions: gcloud projects get-iam-policy $PROJECT_ID"
  exit 1
fi

