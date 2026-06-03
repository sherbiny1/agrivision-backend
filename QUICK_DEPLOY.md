# Quick Deployment Checklist ✅

Follow these steps to deploy your AgriVision backend in **under 15 minutes** using Render (Free):

---

## Step 1: Prepare Your Code (2 minutes)

1. ✅ `.gitignore` file created (already done)
2. ✅ `package.json` has start script (already done)
3. ✅ Check files are ready for deployment

```bash
# Verify everything works locally first
npm install
npm start
```

---

## Step 2: Push to GitHub (3 minutes)

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Ready for deployment"

# Create repository on GitHub first, then:
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/agrivision-backend.git
git push -u origin main
```

---

## Step 3: Deploy on Render (5 minutes)

1. **Go to [render.com](https://render.com)** and sign up (free)

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Click "Connect account" to link GitHub
   - Select your repository: `agrivision-backend`

3. **Configure Service**
   - **Name:** `agrivision-backend` (or your choice)
   - **Environment:** Node
   - **Branch:** main
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free

4. **Add Environment Variables**
   Click "Advanced" → "Add Environment Variable" and add these:

   ```
   MONGO_URI = mongodb://agrivision:agrivision2026@ac-2mafxdf-shard-00-00.gks6pwd.mongodb.net:27017,ac-2mafxdf-shard-00-01.gks6pwd.mongodb.net:27017,ac-2mafxdf-shard-00-02.gks6pwd.mongodb.net:27017/agrivision?ssl=true&replicaSet=atlas-hyxrva-shard-0&authSource=admin&appName=Cluster0
   
   JWT_SECRET = AgriVisionSuperSecretKey2026
   
   EMAIL_USER = astromind322@gmail.com
   
   EMAIL_PASS = grrdffntnywxkpke
   
   BASE_URL = https://agrivision-backend.onrender.com
   ```
   
   ⚠️ **Note:** Update `BASE_URL` after deployment with your actual Render URL

5. **Click "Create Web Service"**
   - Wait 3-5 minutes for deployment
   - Watch the build logs

---

## Step 4: Update MongoDB Access (2 minutes)

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Go to "Network Access"
3. Click "Add IP Address"
4. Click "Allow Access from Anywhere" → `0.0.0.0/0`
5. Click "Confirm"

⚠️ This allows Render's servers to connect to your database

---

## Step 5: Test Your API (2 minutes)

Your API URL will be: `https://agrivision-backend.onrender.com`

### Test in browser:
```
https://agrivision-backend.onrender.com/api/farmer/knowledge-base
```

### Test with curl:
```bash
curl -X POST https://agrivision-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'
```

### Update the BASE_URL:
1. Go back to Render dashboard
2. Click on your service → "Environment"
3. Edit `BASE_URL` to: `https://agrivision-backend.onrender.com`
4. Save changes (auto-redeploys)

---

## Step 6: Update Your Mobile App

In your mobile app (React Native/Flutter), update the API base URL:

```javascript
// Before (local)
const API_BASE_URL = 'http://YOUR_IP_ADDRESS:5000/api';

// After (production)
const API_BASE_URL = 'https://agrivision-backend.onrender.com/api';
```

---

## 🎉 Done!

Your backend is now live and accessible from anywhere!

### Important Notes:

⚠️ **Free Tier Limitation:** Render's free tier spins down after 15 minutes of inactivity. First request after inactivity takes ~30 seconds. This is fine for development/testing.

💡 **To avoid cold starts:** Upgrade to paid tier ($7/month) or use a service like [UptimeRobot](https://uptimerobot.com) to ping your API every 10 minutes.

---

## Monitoring Your App

- **View Logs:** Render Dashboard → Your Service → "Logs"
- **Check Status:** Render Dashboard → Your Service → "Events"
- **Update Code:** Just push to GitHub - auto-deploys!

```bash
# Make changes, then:
git add .
git commit -m "Update feature"
git push
# Render auto-deploys in ~2 minutes
```

---

## Troubleshooting

### "Service unavailable" error?
- Check MongoDB Atlas network access allows `0.0.0.0/0`
- Check environment variables are set correctly
- View logs in Render dashboard

### CORS errors from mobile app?
- Make sure your app's API URL matches exactly
- Check CORS is enabled in your Express app

### Need help?
Check the full `DEPLOYMENT_GUIDE.md` for detailed instructions and alternative deployment options.

---

## Next Steps

1. ✅ Deploy backend ← **You are here**
2. 🔄 Update mobile app API URL
3. 🧪 Test all endpoints
4. 📊 Add monitoring (optional)
5. 🚀 Launch your app!

Good luck! 🌱
