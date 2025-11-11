# Migration from Django to Vercel Serverless Functions

This document explains how the Django backend has been replaced with Vercel serverless functions.

## What Changed

### Before (Django)
- Django backend running on Heroku
- Python code handling Google Sheets, Booqable, and Google Calendar
- Separate backend and frontend deployments

### After (Vercel)
- All backend logic moved to Vercel serverless functions
- TypeScript/Node.js implementation
- Single deployment on Vercel (frontend + API)

## Key Differences

### 1. API Routes
- **Django**: `/submitformdetails/` (Django URL routing)
- **Vercel**: `/api/submitformdetails` (Vercel serverless function)

### 2. Language
- **Django**: Python with libraries like `gspread`, `pandas`, `urllib3`
- **Vercel**: TypeScript with `googleapis`, `google-auth-library`, native `fetch`

### 3. Authentication
- **Django**: Service account JSON file stored in `keys/` folder
- **Vercel**: Environment variables (more secure, no files to manage)

### 4. Data Processing
- **Django**: Uses `pandas` DataFrames for complex data manipulation
- **Vercel**: Native JavaScript arrays and objects (simpler, faster)

## Function Mapping

| Django Function | Vercel API Route | Location |
|----------------|-----------------|----------|
| `submitformdetails` | `/api/submitformdetails` | `api/submitformdetails/index.ts` |
| `processcustomeracct` | `/api/processcustomeracct` | `api/processcustomeracct/index.ts` |
| `processorders` | `/api/processorders` | `api/processorders/index.ts` |
| `retrieveformdetails` | `/api/retrieveformdetails` | `api/retrieveformdetails/index.ts` |
| `updatecustomerinGSview` | `/api/updatecustomerings` | `api/updatecustomerings/index.ts` |
| `updateorderinGSview` | `/api/updateorderings` | `api/updateorderings/index.ts` |
| `updateinvoiceinGSview` | `/api/updateinvoiceings` | `api/updateinvoiceings/index.ts` |
| `updatefittingdatesinGSview` | `/api/updatefittingdatesings` | `api/updatefittingdatesings/index.ts` |

## Utility Functions

All shared logic has been moved to `api/utils/`:

- `googleSheets.ts` - Google Sheets operations (replaces `gspread`)
- `booqable.ts` - Booqable API client (replaces `urllib3` calls)
- `googleCalendar.ts` - Google Calendar operations (replaces `googleapiclient`)
- `dateUtils.ts` - Date formatting and form data processing (replaces `datetime` and `dateutil`)

## Benefits of Migration

1. **Single Deployment**: Frontend and backend in one place
2. **Better Performance**: Serverless functions scale automatically
3. **Cost Effective**: Pay only for what you use
4. **Type Safety**: TypeScript catches errors at compile time
5. **Easier Maintenance**: All code in one repository
6. **No Server Management**: Vercel handles infrastructure

## Migration Checklist

- [x] Port Google Sheets integration
- [x] Port Booqable API integration
- [x] Port Google Calendar integration
- [x] Port form data processing
- [x] Create API route handlers
- [x] Update frontend API calls
- [x] Add environment variable documentation
- [ ] Test all API endpoints
- [ ] Set up environment variables in Vercel
- [ ] Deploy and verify functionality

## Testing

To test locally, you'll need to:

1. Install dependencies: `npm install`
2. Set up environment variables (see `ENV_SETUP.md`)
3. Run Vercel dev server: `vercel dev` (or use `npm run dev` for frontend only)

Note: For full API testing, you need Vercel CLI and proper environment variables set up.

