# 🚀 Deploy Your Backend NOW - Step by Step

Follow these exact steps to deploy your backend for Flutter developer:

---

## ⏱️ Time Required: 10-15 minutes

---

## Step 1: Create GitHub Account (if you don't have one)

Go to: https://github.com/signup

---

## Step 2: Push Your Code to GitHub

### Option A: Using GitHub Desktop (Easiest)

1. **Download GitHub Desktop:** https://desktop.github.com/
2. **Install and login** with your GitHub account
3. **Add your project:**
   - Click "Add" → "Add Existing Repository"
   - Browse to: `C:\Users\melsh\OneDrive\Desktop\BE AGRI`
   - Click "Add Repository"
4. **Create repository on GitHub:**
   - Click "Publish repository"
   - Name: `agrivision-backend`
   - Uncheck "Keep this code private" (or leave checked if you want it private)
   - Click "Publish repository"

✅ **Done! Your code is now on GitHub.**

### Option B: Using Command Line

Open Git Bash in your project folder and run:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - ready for deployment"

# Create repository on GitHub first at: https://github.com/new
# Then connect it:
git remote add origin https://github.com/YOUR_USERNAME/agrivision-backend.git
git branch -M main
git push -u origin main
```

---

## Step 3: Deploy on Render (FREE)

### 3.1 Create Render Account

1. Go to: https://render.com
2. Click "Get Started"
3. Sign up with GitHub (easiest option)
4. Authorize Render to access your GitHub

### 3.2 Create Web Service

1. Click "New +" button (top right)
2. Select "Web Service"
3. Click "Connect account" if needed
4. Find and select your repository: `agrivision-backend`
5. Click "Connect"

### 3.3 Configure the Service

Fill in these settings:

| Field | Value |
|-------|-------|
| **Name** | `agrivision-backend` (or your choice) |
| **Environment** | Node |
| **Branch** | main |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |

### 3.4 Add Environment Variables

Click "Advanced" → Scroll to "Environment Variables"

Click "Add Environment Variable" and add these **ONE BY ONE**:

```
Key: PORT
Value: 5000
```

```
Key: MONGO_URI
Value: mongodb://agrivision:agrivision2026@ac-2mafxdf-shard-00-00.gks6pwd.mongodb.net:27017,ac-2mafxdf-shard-00-01.gks6pwd.mongodb.net:27017,ac-2mafxdf-shard-00-02.gks6pwd.mongodb.net:27017/agrivision?ssl=true&replicaSet=atlas-hyxrva-shard-0&authSource=admin&appName=Cluster0
```

```
Key: JWT_SECRET
Value: AgriVisionSuperSecretKey2026
```

```
Key: EMAIL_USER
Value: astromind322@gmail.com
```

```
Key: EMAIL_PASS
Value: grrdffntnywxkpke
```

```
Key: BASE_URL
Value: https://agrivision-backend.onrender.com
```

**⚠️ Note:** If your app name is different, update the BASE_URL accordingly.

### 3.5 Select Plan

- Scroll down to "Instance Type"
- Select **"Free"**

### 3.6 Deploy!

1. Click **"Create Web Service"** (blue button at bottom)
2. Wait 3-5 minutes for deployment
3. Watch the logs - you'll see:
   - Installing dependencies...
   - Starting server...
   - "Build successful"
   - "Your service is live" ✅

---

## Step 4: Update MongoDB Settings

**Important:** Allow Render to connect to your database

1. Go to: https://cloud.mongodb.com
2. Login with your MongoDB Atlas account
3. Click on your cluster
4. Click "Network Access" (left sidebar)
5. Click "Add IP Address"
6. Click "Allow Access from Anywhere"
7. Enter `0.0.0.0/0` in the field
8. Click "Confirm"

✅ **Done! Database is now accessible.**

---

## Step 5: Get Your API URL

After deployment completes:

1. In Render dashboard, you'll see your service URL at the top
2. It will look like: `https://agrivision-backend.onrender.com`
3. Your API base URL is: `https://agrivision-backend.onrender.com/api`

**Copy this URL - you'll give it to Flutter developer!**

---

## Step 6: Update BASE_URL (Important!)

1. In Render dashboard, click on your service
2. Go to "Environment" tab (left sidebar)
3. Find the `BASE_URL` variable
4. Click the edit icon
5. Update it to your actual Render URL: `https://your-actual-app-name.onrender.com`
6. Click "Save Changes"
7. Service will automatically redeploy (takes 1-2 minutes)

---

## Step 7: Test Your API

### Test in Browser:

Open this URL in your browser:
```
https://your-app-name.onrender.com/
```

You should see: **"AgriVision AI API is running..."**

### Test API Endpoint:

Open this URL:
```
https://your-app-name.onrender.com/api/auth/login
```

You should see an error message (because you didn't send credentials) - that's GOOD! It means the API is working.

---

## Step 8: Give Flutter Developer the Info

Send this to your Flutter developer:

```
✅ Backend is deployed and ready!

API Base URL: https://YOUR-ACTUAL-URL.onrender.com/api

Documentation: See FOR_FLUTTER_DEVELOPER.md file

Full API docs: See API_DOCUMENTATION.md file

⚠️ Important: First request after 15 minutes takes 30 seconds (free tier cold start)
```

Also share these files with Flutter developer:
- `FOR_FLUTTER_DEVELOPER.md` - Integration guide
- `API_DOCUMENTATION.md` - Complete API reference

---

## ✅ Deployment Complete!

Your backend is now live and accessible from anywhere!

---

## 📊 Monitor Your Backend

### View Logs:
1. Render Dashboard → Your Service → "Logs"
2. You can see all requests and errors in real-time

### Check Status:
1. Render Dashboard → Your Service → "Events"
2. See deployment history and status

### Update Code:
When you want to update your backend:
1. Make changes in your code
2. Using GitHub Desktop: Commit and push changes
3. Render will automatically redeploy! (no manual steps needed)

---

## 🐛 Troubleshooting

### "Service is unavailable"
- Check Render logs for errors
- Verify MongoDB Network Access allows `0.0.0.0/0`
- Check all environment variables are set correctly

### "Cannot connect to MongoDB"
- Go to MongoDB Atlas → Network Access
- Make sure `0.0.0.0/0` is in the IP whitelist

### "Build failed"
- Check Render logs for the specific error
- Usually: missing environment variable
- Go to Environment tab and verify all variables

### Need to restart service?
- Render Dashboard → Your Service → "Manual Deploy" → "Deploy latest commit"

---

## 💰 Cost

**Current Setup: 100% FREE**

- Render Free Tier: $0/month
- MongoDB Atlas Free Tier: $0/month

**Limitations:**
- Render free tier spins down after 15 minutes of inactivity
- First request after sleep takes ~30 seconds
- Perfect for development, testing, and low-traffic apps

**To upgrade later:** $7/month for always-on service

---

## 🎯 What's Next?

1. ✅ Backend is deployed
2. ⏳ Flutter developer integrates the API
3. 🧪 Test all features together
4. 🚀 Launch your app!

---

**Your API is ready! Give the URL to your Flutter developer and they can start working! 🌱**

---

## Quick Reference

| Item | Value |
|------|-------|
| **Your Render Dashboard** | https://dashboard.render.com |
| **MongoDB Dashboard** | https://cloud.mongodb.com |
| **Your API URL** | `https://your-app-name.onrender.com/api` |
| **API Docs** | See `API_DOCUMENTATION.md` |
| **Flutter Integration** | See `FOR_FLUTTER_DEVELOPER.md` |

---

**Need help? Check the logs in Render dashboard first!**
