# Vercel Deployment Guide

## Serverless Functions Auto-Deployment

Vercel **automatically detects and deploys** serverless functions in the `/api` folder. You don't need to deploy them separately!

However, there are a few things to check:

## 1. Verify Functions Are Deployed

After deploying, check your Vercel dashboard:
1. Go to your project → **Functions** tab
2. You should see all 8 API routes listed:
   - `/api/submitformdetails`
   - `/api/processcustomeracct`
   - `/api/processorders`
   - `/api/retrieveformdetails`
   - `/api/updatecustomerings`
   - `/api/updateorderings`
   - `/api/updateinvoiceings`
   - `/api/updatefittingdatesings`

If they're not there, the deployment might have failed.

## 2. Check Browser Console for Errors

Open your browser's Developer Tools (F12) and check:
- **Console tab**: Look for JavaScript errors
- **Network tab**: Check if API calls are being made and what responses you're getting

Common issues:
- `404 Not Found` → Functions not deployed
- `500 Internal Server Error` → Function error (check Vercel logs)
- `CORS error` → Shouldn't happen with same-origin, but check
- `Network error` → Check if API_BASE_URL is correct

## 3. Set Environment Variables

**Critical:** The serverless functions need these environment variables in Vercel:

1. Go to Vercel project → **Settings** → **Environment Variables**
2. Add these variables (for Production, Preview, and Development):

### Required Variables:

```
GOOGLE_SHEETS_CREDENTIALS
```
- Value: The entire JSON content from `tgc/keys/tgc-01-2025November.json`
- Format: Single-line JSON string (you may need to escape quotes)
- Example: `{"type":"service_account","project_id":"tgc-01",...}`

```
GOOGLE_SHEET_ID
```
- Value: Your Google Spreadsheet ID (from the URL)
- Example: `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms`

```
BOOQABLE_API_KEY
```
- Value: Your Booqable API key
- Example: `f60d7f0857a3be54cd7b6427f7e61e9c`

### Optional (for Calendar features):

```
GOOGLE_CALENDAR_CREDENTIALS
```
- Can be the same as `GOOGLE_SHEETS_CREDENTIALS` if using the same service account

## 4. Test API Routes Directly

You can test the API routes directly in your browser or with curl:

```bash
# Test submitformdetails
curl -X POST https://your-app.vercel.app/api/submitformdetails \
  -H "Content-Type: application/json" \
  -d '{"bridename":"Test","emailfield":"test@example.com"}'
```

Or visit in browser (should return method not allowed for GET):
```
https://your-app.vercel.app/api/submitformdetails
```

## 5. Check Vercel Build Logs

1. Go to Vercel dashboard → Your project → **Deployments**
2. Click on the latest deployment
3. Check the **Build Logs** for any errors
4. Check the **Function Logs** for runtime errors

## 6. Common Issues & Fixes

### Issue: "Functions not found"
**Fix:** Make sure the `/api` folder is in the root of your project (not in `src/`)

### Issue: "Module not found" errors
**Fix:** The functions need `@vercel/node` package. Check `package.json` has it in devDependencies.

### Issue: "Environment variable not set"
**Fix:** 
1. Set the env vars in Vercel dashboard
2. Redeploy after setting env vars
3. Make sure you selected all environments (Production, Preview, Development)

### Issue: "Google Sheets authentication error"
**Fix:**
1. Verify `GOOGLE_SHEETS_CREDENTIALS` is set correctly
2. Make sure the JSON is valid (no extra quotes/escapes)
3. Verify the service account has access to your Google Sheet

### Issue: "CORS errors"
**Fix:** Shouldn't happen since frontend and API are on same domain, but if it does:
- Check that API calls use relative URLs (`/api/...`)
- Don't set `VITE_API_BASE_URL` unless pointing to external backend

## 7. Local Testing

To test locally with Vercel CLI:

```bash
cd web
npm install -g vercel
vercel dev
```

This will:
- Start the frontend dev server
- Start the serverless functions locally
- Allow you to test everything before deploying

## 8. Debugging Steps

1. **Check if functions are accessible:**
   ```bash
   curl https://your-app.vercel.app/api/submitformdetails
   # Should return: {"tabletform_msg":"not a POST request."}
   ```

2. **Check environment variables:**
   - Go to Vercel dashboard → Settings → Environment Variables
   - Verify all required vars are set
   - Make sure they're enabled for the right environments

3. **Check function logs:**
   - Vercel dashboard → Your project → Functions tab
   - Click on a function to see logs
   - Look for errors when you make API calls

4. **Test with a simple function:**
   Create a test endpoint to verify functions work:
   ```typescript
   // api/test/index.ts
   export default function handler(req, res) {
     res.json({ message: 'API is working!', env: !!process.env.GOOGLE_SHEETS_CREDENTIALS });
   }
   ```

## Quick Checklist

- [ ] Functions are listed in Vercel dashboard
- [ ] Environment variables are set in Vercel
- [ ] Build completed successfully (check deployment logs)
- [ ] No errors in browser console
- [ ] API calls show up in Network tab
- [ ] Function logs show activity (not just errors)

## Still Not Working?

1. Check the browser Network tab to see what URL is being called
2. Check if the response has any error messages
3. Share the error from browser console or Vercel function logs

