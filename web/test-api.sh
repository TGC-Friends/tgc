#!/bin/bash

# Test script for Vercel Serverless API
# Usage: ./test-api.sh [local|deployed] [endpoint]

MODE=${1:-local}
ENDPOINT=${2:-test}

if [ "$MODE" = "local" ]; then
  BASE_URL="http://localhost:3000"
  echo "🧪 Testing LOCAL serverless function..."
  echo "⚠️  Make sure you're running: vercel dev"
else
  BASE_URL="https://your-app.vercel.app"  # Replace with your actual Vercel URL
  echo "🧪 Testing DEPLOYED serverless function..."
fi

echo "📍 Testing endpoint: $ENDPOINT"
echo "🔗 URL: $BASE_URL/api?endpoint=$ENDPOINT"
echo ""

# Test endpoint
case $ENDPOINT in
  test)
    echo "Testing basic API connectivity..."
    curl -X POST "$BASE_URL/api?endpoint=test" \
      -H "Content-Type: application/json" \
      -d '{}' \
      | jq .
    ;;
  
  submitformdetails)
    echo "Testing submitformdetails endpoint..."
    curl -X POST "$BASE_URL/api?endpoint=submitformdetails" \
      -H "Content-Type: application/json" \
      -d '{
        "bridename": "Test Bride",
        "groomname": "Test Groom",
        "phonenum": "1234567890",
        "emailfield": "test@example.com",
        "howdidyouhear": "Test Lead",
        "eventdate1": "2025-12-25",
        "eventtype1": "Actual",
        "eventvenue1": "Test Venue",
        "requiredoutfit": ["Bridal Gown"],
        "noofgowns": 1,
        "preferredoutfit": ["A-Line"],
        "preferredstyle": ["Lace Dress"],
        "preferredNeckline": ["Sweetheart"],
        "attendant": "Kelly",
        "additionalnotes": "Test notes"
      }' \
      | jq .
    ;;
  
  retrieveformdetails)
    echo "Testing retrieveformdetails endpoint..."
    curl -X POST "$BASE_URL/api?endpoint=retrieveformdetails" \
      -H "Content-Type: application/json" \
      -d '{
        "emailfield": "test@example.com",
        "phonenum": "1234567890"
      }' \
      | jq .
    ;;
  
  *)
    echo "Unknown endpoint: $ENDPOINT"
    echo "Available endpoints: test, submitformdetails, retrieveformdetails, processcustomeracct, processorders, updatecustomerings, updateorderings, updateinvoiceings, updatefittingdatesings"
    exit 1
    ;;
esac

echo ""
echo "✅ Test complete!"

