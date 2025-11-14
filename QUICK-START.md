# 🚀 Quick Start: Deploy to Cloudflare Pages

Follow these steps **in order**:

## Step 1: Commit Your Code Locally ✅

I've already prepared your files. Now commit them:

```bash
git add .
git commit -m "Ready for Cloudflare Pages deployment"
```

## Step 2: Push to GitHub

### Option A: Create New GitHub Repository

1. Go to https://github.com/new
2. Repository name: `propintelli-wireframe` (or any name you like)
3. Make it **Public** or **Private** (your choice)
4. **DO NOT** initialize with README, .gitignore, or license
5. Click **Create repository**

### Option B: Use Existing Repository

If you already have a GitHub repo, use that URL instead.

### Then Push:

```bash
git remote add origin https://github.com/YOUR-USERNAME/propintelli-wireframe.git
git branch -M main
git push -u origin main
```

*(Replace `YOUR-USERNAME` with your GitHub username)*

## Step 3: Deploy to Cloudflare Pages

1. **Go to Cloudflare Dashboard**
   - Visit: https://dash.cloudflare.com/
   - Sign up or log in (it's free!)

2. **Create Pages Project**
   - Click **Pages** in the left sidebar
   - Click **Create a project**
   - Click **Connect to Git**

3. **Connect GitHub**
   - Select **GitHub**
   - Authorize Cloudflare (click "Authorize Cloudflare")
   - Select your repository: `propintelli-wireframe`
   - Click **Begin setup**

4. **Configure Build Settings**
   - Framework preset: **Next.js** (should auto-detect)
   - Build command: `npm run build`
   - Build output directory: `.next`
   - Root directory: `/` (leave default)

5. **Add Environment Variable** ⚠️ IMPORTANT
   - Scroll down to **Environment variables**
   - Click **Add variable**
   - Variable name: `NEXT_PUBLIC_API_BASE_URL`
   - Value: Your production API URL (e.g., `https://api.yourdomain.com/v1`)
   - Click **Save**

6. **Deploy!**
   - Click **Save and Deploy**
   - Wait 2-3 minutes for build to complete
   - Your site will be live at: `https://propintelli-wireframe.pages.dev` (or similar)

## Step 4: Test Your Deployment

1. Visit your Cloudflare Pages URL
2. Check that the logo loads
3. Test the search functionality
4. Verify API calls work (check browser console)

## 🎉 Done!

Your site is now live on Cloudflare Pages!

### What Happens Next?

- **Automatic Deployments**: Every time you push to `main` branch, Cloudflare will automatically rebuild and deploy
- **Preview Deployments**: Pull requests get preview URLs automatically
- **Custom Domain**: You can add your own domain in Cloudflare Pages settings

## Need Help?

- **Build fails?** Check the build logs in Cloudflare dashboard
- **API not working?** Make sure `NEXT_PUBLIC_API_BASE_URL` is set correctly
- **Questions?** Check `DEPLOY.md` for detailed troubleshooting

