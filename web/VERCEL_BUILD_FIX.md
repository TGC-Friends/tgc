# Fixed Vercel Build Error

## Problem
Vercel was detecting `pnpm-lock.yaml` and trying to use pnpm, which caused:
```
npm error Unsupported URL Type "workspace:": workspace:*
```

## Solution Applied

1. **Deleted `pnpm-lock.yaml`** - This was causing Vercel to use pnpm instead of npm
2. **Updated `.gitignore`** - Added `pnpm-lock.yaml` and `yarn.lock` to prevent them from being committed
3. **Updated `vercel.json`** - Explicitly set `installCommand` to use npm

## What Happens Now

- Vercel will use **npm** (not pnpm)
- It will generate `package-lock.json` automatically
- The build should succeed

## Next Steps

1. **Commit the changes:**
   ```bash
   cd web
   git add .gitignore vercel.json
   git commit -m "fix: remove pnpm-lock.yaml and force npm usage"
   git push
   ```

2. **Vercel will automatically:**
   - Detect npm (no pnpm-lock.yaml)
   - Run `npm install --legacy-peer-deps`
   - Build the project
   - Deploy functions

## If Build Still Fails

If you still get errors, check:
- Vercel dashboard → Deployment → Build Logs
- Make sure no `pnpm-lock.yaml` exists in the repo
- Verify `package.json` doesn't have workspace configuration

## Note

The `--legacy-peer-deps` flag is added to handle any peer dependency conflicts. If you don't need it, you can remove it from `vercel.json`.

