# The Gown Connoisseur - React Web Application

This is a React + TypeScript + Vite application that replicates the Django form application for The Gown Connoisseur.

## Features

- Customer information form (bride/groom names, contact info)
- Event details (up to 3 events with dates, types, and venues)
- Gown preferences (silhouette, style, neckline with image galleries)
- Integration with backend API for form submission
- Retrieve previous form submissions by email/phone
- Manual update tools for customers, orders, and invoices

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React DatePicker** - Date input component
- **date-fns** - Date utilities

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Create a `.env` file in the root directory:
```
VITE_API_BASE_URL=http://your-django-backend-url
```

3. Copy images:
Ensure all images from `tgc/static/images/` are copied to `src/assets/images/`

4. Run development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
```

## Deployment to Vercel

1. Push your code to a Git repository
2. Import the project in Vercel
3. Set the environment variable `VITE_API_BASE_URL` to your Django backend URL
4. Deploy!

The `vercel.json` file is already configured for Vite projects.

## Backend Integration

**This application now includes its own backend!** The Django backend is no longer required.

The backend functions are implemented as Vercel serverless functions in the `/api` directory. These handle:

- Google Sheets integration
- Booqable API integration  
- Google Calendar integration
- Form data processing

### API Routes

All API routes are located in `/api` and automatically deployed as Vercel serverless functions:

- `POST /api/submitformdetails` - Submit form data to Google Sheets
- `POST /api/processcustomeracct` - Create/update customer in Booqable and Google Sheets
- `POST /api/processorders` - Create/update orders in Booqable and Google Sheets
- `POST /api/retrieveformdetails` - Retrieve form by email/phone from Google Sheets
- `POST /api/updatecustomerings` - Update customer in Google Sheets from Booqable
- `POST /api/updateorderings` - Update order in Google Sheets from Booqable
- `POST /api/updateinvoiceings` - Update invoice in Google Sheets from Booqable
- `POST /api/updatefittingdatesings` - Update fitting dates from Google Calendar

### Environment Variables

See `ENV_SETUP.md` for detailed instructions on setting up environment variables for:
- Google Sheets credentials
- Google Sheet ID
- Booqable API key
- Google Calendar credentials (optional)

## Project Structure

```
web/
├── src/
│   ├── assets/
│   │   └── images/          # Image assets
│   ├── components/          # React components
│   │   ├── Form.tsx
│   │   ├── PersonalInfoSection.tsx
│   │   ├── EventDetailsSection.tsx
│   │   ├── GownPreferencesSection.tsx
│   │   ├── OfficialUseSection.tsx
│   │   ├── StatusCards.tsx
│   │   ├── ManualUpdateCards.tsx
│   │   └── RetrieveSection.tsx
│   ├── api.ts               # API service layer
│   ├── types.ts             # TypeScript type definitions
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── vercel.json
```

## Notes

- The form data format matches the Django backend expectations
- Date format is DD-MM-YYYY to match the original Django form
- Checkbox arrays are sent as comma-separated strings
- The application maintains the same UI/UX as the original Django template

