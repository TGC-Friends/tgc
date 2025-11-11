# Testing Vercel Serverless Endpoints

## Quick Start

### 1. Test Locally (Recommended for Development)

First, install Vercel CLI if you haven't:
```bash
npm install -g vercel
```

Then run the dev server:
```bash
cd web
vercel dev
```

This will:
- Start a local server (usually at `http://localhost:3000`)
- Load your environment variables from `.env.local` (create this file if needed)
- Hot-reload on changes

### 2. Test the Basic Endpoint

The simplest test is the built-in test endpoint:

**Using curl:**
```bash
curl -X POST "http://localhost:3000/api?endpoint=test" \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Using the test script:**
```bash
chmod +x test-api.sh
./test-api.sh local test
```

**Expected response:**
```json
{
  "message": "API is working!",
  "method": "POST",
  "endpoint": "test",
  "hasGoogleSheetsCreds": true,
  "hasGoogleSheetId": true,
  "hasBooqableKey": true,
  "timestamp": "2025-01-11T12:00:00.000Z"
}
```

## Testing Methods

### Method 1: Using curl (Command Line)

#### Test Endpoint
```bash
curl -X POST "http://localhost:3000/api?endpoint=test" \
  -H "Content-Type: application/json" \
  -d '{}'
```

#### Submit Form Details
```bash
curl -X POST "http://localhost:3000/api?endpoint=submitformdetails" \
  -H "Content-Type: application/json" \
  -d '{
    "bridename": "Jane Doe",
    "groomname": "John Doe",
    "phonenum": "1234567890",
    "emailfield": "jane@example.com",
    "howdidyouhear": "Instagram",
    "eventdate1": "2025-12-25",
    "eventtype1": "Actual",
    "eventvenue1": "Grand Hotel",
    "requiredoutfit": ["Bridal Gown"],
    "noofgowns": 1,
    "preferredoutfit": ["A-Line"],
    "preferredstyle": ["Lace Dress"],
    "preferredNeckline": ["Sweetheart"],
    "attendant": "Kelly",
    "additionalnotes": "Looking for something elegant"
  }'
```

#### Retrieve Form Details
```bash
curl -X POST "http://localhost:3000/api?endpoint=retrieveformdetails" \
  -H "Content-Type: application/json" \
  -d '{
    "emailfield": "jane@example.com",
    "phonenum": "1234567890"
  }'
```

### Method 2: Using the Test Script

```bash
# Test locally
./test-api.sh local test
./test-api.sh local submitformdetails
./test-api.sh local retrieveformdetails

# Test deployed (update BASE_URL in script first)
./test-api.sh deployed test
```

### Method 3: Using Postman or Insomnia

1. **Create a new POST request**
2. **URL**: `http://localhost:3000/api?endpoint=test` (or your endpoint)
3. **Headers**:
   - `Content-Type: application/json`
4. **Body** (raw JSON):
   ```json
   {
     "bridename": "Jane Doe",
     "emailfield": "jane@example.com",
     ...
   }
   ```

### Method 4: Using Browser DevTools

Open your browser console and run:

```javascript
// Test endpoint
fetch('/api?endpoint=test', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({})
})
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);

// Submit form
fetch('/api?endpoint=submitformdetails', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    bridename: "Jane Doe",
    emailfield: "jane@example.com",
    phonenum: "1234567890",
    // ... other fields
  })
})
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);
```

## Testing Deployed Endpoints

### Get Your Vercel URL

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Copy the deployment URL (e.g., `https://your-app.vercel.app`)

### Test Deployed API

```bash
# Replace with your actual URL
curl -X POST "https://your-app.vercel.app/api?endpoint=test" \
  -H "Content-Type: application/json" \
  -d '{}'
```

## Available Endpoints

| Endpoint | Description | Required Fields |
|----------|-------------|----------------|
| `test` | Health check, shows env var status | None |
| `submitformdetails` | Submit initial form data | See Form.tsx |
| `retrieveformdetails` | Get existing form data | `emailfield`, `phonenum` |
| `processcustomeracct` | Create/update customer in Booqable | Form data |
| `processorders` | Create orders in Booqable | Form data |
| `updatecustomerings` | Update customer in Google Sheets | Customer data |
| `updateorderings` | Update order in Google Sheets | Order data |
| `updateinvoiceings` | Update invoice in Google Sheets | Invoice data |
| `updatefittingdatesings` | Sync fitting dates from Calendar | None |

## Environment Variables Setup

For local testing, create `web/.env.local`:

```bash
GOOGLE_SHEETS_CREDENTIALS='{"type":"service_account",...}'
GOOGLE_SHEET_ID='your-sheet-id'
BOOQABLE_API_KEY='your-booqable-key'
```

**⚠️ Important**: Never commit `.env.local` to git!

## Troubleshooting

### Error: "Cannot find module"
- Make sure you're in the `web` directory
- Run `npm install` to install dependencies

### Error: "Environment variable not found"
- Check `.env.local` exists and has correct variable names
- Restart `vercel dev` after changing `.env.local`

### Error: "Function timeout"
- Some operations (like Google Calendar sync) can take time
- Check Vercel function logs for details

### Error: "Invalid credentials"
- Verify `GOOGLE_SHEETS_CREDENTIALS` is valid JSON
- Ensure service account has access to the Google Sheet
- Check `GOOGLE_SHEET_ID` is correct

## Viewing Logs

### Local Logs
Logs appear in the terminal where `vercel dev` is running.

### Deployed Logs
1. Go to Vercel Dashboard → Your Project
2. Click on a deployment
3. Go to "Functions" tab
4. Click on a function to see logs

## Next Steps

1. ✅ Test the `test` endpoint first to verify connectivity
2. ✅ Test `submitformdetails` with sample data
3. ✅ Test `retrieveformdetails` to verify data retrieval
4. ✅ Test other endpoints as needed
5. ✅ Check Vercel function logs for any errors

