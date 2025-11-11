# Quick Test Guide

## 🚀 Fastest Way to Test

### 1. Install Vercel CLI (if not installed)
```bash
npm install -g vercel
```

### 2. Start Local Dev Server
```bash
cd web
vercel dev
```

### 3. Test in Another Terminal

**Basic test (checks if API works):**
```bash
curl -X POST "http://localhost:3000/api?endpoint=test" \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Or use the test script:**
```bash
./test-api.sh local test
```

## 📋 What the Test Endpoint Shows

The `test` endpoint returns:
- ✅ API connectivity status
- ✅ Which environment variables are set
- ✅ Current timestamp

**Example response:**
```json
{
  "message": "API is working!",
  "method": "POST",
  "endpoint": "test",
  "hasGoogleSheetsCreds": true,    // ← Check this
  "hasGoogleSheetId": true,         // ← Check this
  "hasBooqableKey": true,           // ← Check this
  "timestamp": "2025-01-11T12:00:00.000Z"
}
```

## 🔧 Setup Environment Variables for Local Testing

Create `web/.env.local`:
```bash
GOOGLE_SHEETS_CREDENTIALS='{"type":"service_account",...}'
GOOGLE_SHEET_ID='your-sheet-id-here'
BOOQABLE_API_KEY='your-booqable-key-here'
```

**Get credentials:**
- `GOOGLE_SHEETS_CREDENTIALS`: Copy from Heroku config vars or your JSON file
- `GOOGLE_SHEET_ID`: From Google Sheets URL (see `FIND_GOOGLE_SHEET_ID.md`)
- `BOOQABLE_API_KEY`: From your Booqable account settings

## 🌐 Test Deployed Version

Replace `your-app.vercel.app` with your actual Vercel URL:

```bash
curl -X POST "https://your-app.vercel.app/api?endpoint=test" \
  -H "Content-Type: application/json" \
  -d '{}'
```

## 📚 More Details

See `TEST_API.md` for:
- All available endpoints
- Full curl examples
- Postman/Insomnia setup
- Troubleshooting guide

