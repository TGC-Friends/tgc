# Quick Fix for Vercel API Issues

## Step 1: Verify Functions Are Deployed

1. Go to your Vercel dashboard
2. Click on your project
3. Go to the **Functions** tab
4. You should see 9 functions listed (including the test one)

If you don't see them, the functions aren't being detected.

## Step 2: Set Environment Variables (CRITICAL)

Go to Vercel → Your Project → Settings → Environment Variables

Add these 3 variables:

### 1. GOOGLE_SHEETS_CREDENTIALS
```bash
# Get the value (run this locally):
cat tgc/keys/tgc-01-2025November.json | jq -c .
```
Copy the entire output and paste it as the value.

### 2. GOOGLE_SHEET_ID
Get this from your Google Sheet URL:
```
https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID_HERE/edit
```

### 3. BOOQABLE_API_KEY
```
f60d7f0857a3be54cd7b6427f7e61e9c
```

**Important:** Make sure to enable these for:
- ✅ Production
- ✅ Preview  
- ✅ Development

## Step 3: Test the API

After setting env vars and redeploying, test:

1. Visit: `https://your-app.vercel.app/api/test`
   - Should show: `{"message":"API is working!",...}`

2. Check browser console when submitting form:
   - Open DevTools (F12) → Network tab
   - Submit the form
   - Look for requests to `/api/submitformdetails`
   - Check the response

## Step 4: Redeploy

After setting environment variables:
1. Go to Vercel dashboard
2. Click "Redeploy" on the latest deployment
3. Or push a new commit to trigger redeploy

## Common Issues

### "Functions not found" or 404 errors
- Make sure `/api` folder is in the **root** of your project (not in `src/`)
- Check that `vercel.json` has the functions configuration
- Redeploy after making changes

### "Environment variable not set"
- Double-check env vars are set in Vercel dashboard
- Make sure they're enabled for the right environment
- Redeploy after setting them

### Functions show errors in Vercel dashboard
- Click on the function → View logs
- Check for specific error messages
- Common: Missing env vars, Google Sheets auth errors

## Debug Commands

Test locally with Vercel CLI:
```bash
cd web
npm install -g vercel
vercel dev
```

Then visit `http://localhost:3000` and test the form.

