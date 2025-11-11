# Setup Instructions

## Prerequisites

- Node.js 18+ and npm installed
- Access to the Django backend API

## Initial Setup

1. **Install dependencies:**
   ```bash
   cd web
   npm install
   ```

2. **Copy images (if not already copied):**
   ```bash
   # From the project root
   cp tgc/static/images/* web/src/assets/images/
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env
   ```
   
   Then edit `.env` and set your Django backend URL:
   ```
   VITE_API_BASE_URL=http://localhost:8000
   ```
   
   For production, use your Heroku/Django backend URL:
   ```
   VITE_API_BASE_URL=https://your-backend.herokuapp.com
   ```

4. **Run development server:**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

## Building for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` folder.

## Deploying to Vercel

1. **Push your code to GitHub/GitLab/Bitbucket**

2. **Import project in Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your repository
   - Vercel will auto-detect Vite

3. **Set environment variable:**
   - In Vercel project settings, add:
     - Key: `VITE_API_BASE_URL`
     - Value: Your Django backend URL (e.g., `https://your-backend.herokuapp.com`)

4. **Deploy!**
   - Vercel will automatically build and deploy

## Important Notes

- **CORS Configuration**: Make sure your Django backend has CORS configured to allow requests from your Vercel domain
- **API Endpoints**: The frontend expects the Django backend to be running with all the original endpoints
- **Image Assets**: All images should be in `src/assets/images/` - they're already copied if you see them in that folder

## Troubleshooting

### Images not loading
- Check that all images are in `src/assets/images/`
- Verify image file names match exactly (case-sensitive)
- Check browser console for 404 errors

### API calls failing
- Verify `VITE_API_BASE_URL` is set correctly
- Check Django backend is running and accessible
- Verify CORS settings in Django backend
- Check browser network tab for error details

### Build errors
- Make sure all dependencies are installed: `npm install`
- Check TypeScript errors: `npm run build`
- Verify Node.js version is 18+

