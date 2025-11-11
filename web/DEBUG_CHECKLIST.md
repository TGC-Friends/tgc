# Debugging Checklist for Vercel Deployment

## Immediate Checks

### 1. Open Browser Console
- Press F12 or right-click → Inspect
- Go to **Console** tab
- Try submitting the form
- Look for any red error messages
- Share any errors you see

### 2. Check Network Tab
- In DevTools, go to **Network** tab
- Try submitting the form
- Look for requests to `/api/submitformdetails`
- Click on the request and check:
  - **Status**: Should be 200 (not 404 or 500)
  - **Response**: What does it say?
  - **Headers**: Check the request URL

### 3. Test API Directly
Visit this URL in your browser (replace with your Vercel URL):
```
https://your-app.vercel.app/api/test
```

**Expected:** Should show JSON with `"message": "API is working!"`

**If 404:** Functions aren't deployed
**If 500:** Function error (check Vercel logs)
**If works:** Functions are deployed, issue is elsewhere

## Vercel Dashboard Checks

### 1. Functions Tab
- Go to Vercel → Your Project → **Functions**
- Should see 9 functions listed
- Click on one → Check for errors in logs

### 2. Environment Variables
- Go to **Settings** → **Environment Variables**
- Verify these are set:
  - `GOOGLE_SHEETS_CREDENTIALS`
  - `GOOGLE_SHEET_ID`
  - `BOOQABLE_API_KEY`
- Make sure they're enabled for **Production**

### 3. Deployment Logs
- Go to **Deployments** → Click latest deployment
- Check **Build Logs** for errors
- Check **Function Logs** for runtime errors

## Common Scenarios

### Scenario 1: Nothing happens when clicking submit
**Check:**
- Browser console for JavaScript errors
- Network tab to see if request is made
- Button is not disabled

**Fix:**
- Check console errors
- Verify form data is being collected
- Check if `handleSubmit` is being called

### Scenario 2: 404 errors in Network tab
**Meaning:** Functions not deployed or wrong URL

**Fix:**
- Check Vercel Functions tab
- Verify `/api` folder structure
- Check `vercel.json` configuration
- Redeploy

### Scenario 3: 500 errors in Network tab
**Meaning:** Function error (check Vercel logs)

**Fix:**
- Go to Vercel → Functions → Click the failing function
- Check logs for specific error
- Usually: Missing env vars or Google Sheets auth error

### Scenario 4: CORS errors
**Meaning:** Shouldn't happen, but if it does...

**Fix:**
- Make sure `VITE_API_BASE_URL` is not set (or set to `/api`)
- Check that API calls use relative URLs

## Quick Test Commands

```bash
# Test if API is accessible
curl https://your-app.vercel.app/api/test

# Test submit endpoint (should return "not a POST request")
curl https://your-app.vercel.app/api/submitformdetails

# Test with POST
curl -X POST https://your-app.vercel.app/api/submitformdetails \
  -H "Content-Type: application/json" \
  -d '{"bridename":"Test"}'
```

## What to Share for Help

If still not working, share:
1. Browser console errors (screenshot or copy text)
2. Network tab request/response (screenshot)
3. Vercel function logs (from dashboard)
4. Your Vercel app URL

