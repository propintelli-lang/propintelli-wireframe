# Deploying to Cloudflare Pages

This guide will help you deploy your PropIntelli wireframe application to Cloudflare Pages.

## Prerequisites

1. A Cloudflare account (sign up at https://dash.cloudflare.com/sign-up)
2. Your project code in a Git repository (GitHub, GitLab, or Bitbucket)
3. Your API base URL for production

## Method 1: Deploy via Cloudflare Dashboard (Recommended)

### Step 1: Push to Git Repository

First, make sure your code is in a Git repository:

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - ready for Cloudflare Pages"

# Push to your Git provider (GitHub, GitLab, or Bitbucket)
git remote add origin <your-repo-url>
git push -u origin main
```

### Step 2: Connect to Cloudflare Pages

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Pages** in the sidebar
3. Click **Create a project**
4. Click **Connect to Git**
5. Select your Git provider (GitHub, GitLab, or Bitbucket)
6. Authorize Cloudflare to access your repositories
7. Select your repository (`propintelli-wireframe` or your repo name)
8. Click **Begin setup**

### Step 3: Configure Build Settings

Cloudflare Pages should auto-detect Next.js, but verify these settings:

- **Framework preset**: `Next.js`
- **Build command**: `npm run build`
- **Build output directory**: `.next`
- **Root directory**: `/` (leave as default)

### Step 4: Add Environment Variables

In the build settings, scroll down to **Environment variables** and add:

- **Variable name**: `NEXT_PUBLIC_API_BASE_URL`
- **Value**: Your production API URL (e.g., `https://your-api-domain.com/v1`)

Click **Save and Deploy**

### Step 5: Wait for Deployment

Cloudflare will:
1. Install dependencies
2. Build your Next.js app
3. Deploy it to a preview URL

Once complete, you'll get a URL like: `https://your-project.pages.dev`

## Method 2: Deploy via Wrangler CLI

### Step 1: Install Wrangler

```bash
npm install -g wrangler
```

### Step 2: Login to Cloudflare

```bash
wrangler login
```

This will open your browser to authenticate.

### Step 3: Create a Pages Project

```bash
wrangler pages project create propintelli-wireframe
```

### Step 4: Deploy

```bash
# Build the project first
npm run build

# Deploy to Cloudflare Pages
wrangler pages deploy .next --project-name=propintelli-wireframe
```

### Step 5: Set Environment Variables

```bash
wrangler pages secret put NEXT_PUBLIC_API_BASE_URL
# Enter your API URL when prompted
```

## Custom Domain (Optional)

1. In Cloudflare Pages dashboard, go to your project
2. Click **Custom domains**
3. Click **Set up a custom domain**
4. Enter your domain name
5. Follow the DNS configuration instructions

## Environment Variables

Make sure to set these in Cloudflare Pages:

- `NEXT_PUBLIC_API_BASE_URL`: Your production API endpoint

You can set these in:
- **Dashboard**: Project Settings → Environment variables
- **CLI**: `wrangler pages secret put VARIABLE_NAME`

## Troubleshooting

### Build Fails

- Check that all dependencies are in `package.json`
- Verify Node.js version (Cloudflare Pages uses Node 18 by default)
- Check build logs in Cloudflare dashboard

### API Not Working

- Verify `NEXT_PUBLIC_API_BASE_URL` is set correctly
- Check CORS settings on your API server
- Ensure the API URL is accessible from the internet

### Images Not Loading

- Verify `Logo.png` is in the `public/` directory (not `app/`)
- Check that image paths use `/Logo.png` (with leading slash)

## Updating Your Deployment

Every time you push to your main branch, Cloudflare Pages will automatically:
1. Detect the change
2. Build the new version
3. Deploy it

You can also manually trigger deployments from the Cloudflare dashboard.

## Preview Deployments

Cloudflare Pages automatically creates preview deployments for pull requests, so you can test changes before merging.

## Need Help?

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Next.js on Cloudflare Pages](https://developers.cloudflare.com/pages/framework-guides/nextjs/)

