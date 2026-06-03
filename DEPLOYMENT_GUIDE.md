# AgriVision AI - Deployment Guide

This guide covers multiple deployment options for your Node.js/Express backend application.

---

## Table of Contents
1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Environment Setup](#environment-setup)
3. [Deployment Options](#deployment-options)
   - [Option 1: Render (Recommended - Free)](#option-1-render-recommended---free)
   - [Option 2: Railway](#option-2-railway)
   - [Option 3: Heroku](#option-3-heroku)
   - [Option 4: DigitalOcean App Platform](#option-4-digitalocean-app-platform)
   - [Option 5: VPS (Ubuntu Server)](#option-5-vps-ubuntu-server)
4. [Post-Deployment](#post-deployment)

---

## Pre-Deployment Checklist

### 1. **Secure Your Environment Variables**
Never commit `.env` file to Git. Make sure it's in `.gitignore`.

### 2. **Update Production URLs**
In production, you'll need to update:
- `BASE_URL` in your environment variables
- CORS settings if applicable
- MongoDB connection string (if using different DB for production)

### 3. **Add Production Scripts**
Your `package.json` already has `"start": "node server.js"` which is perfect.

### 4. **Test Locally**
```bash
npm install
npm start
```

---

## Environment Setup

### Required Environment Variables
Create these in your deployment platform:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
BASE_URL=https://your-deployed-app.com
```

⚠️ **Security Note:** Generate a strong `JWT_SECRET` for production:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## Deployment Options

## Option 1: Render (Recommended - Free)

**Pros:** Free tier, auto-deploys from Git, easy setup, HTTPS included  
**Cons:** Free tier spins down after inactivity (30-second cold start)

### Steps:

1. **Push code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/agrivision-backend.git
   git push -u origin main
   ```

2. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up (free)

3. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name:** `agrivision-backend`
     - **Environment:** `Node`
     - **Build Command:** `npm install`
     - **Start Command:** `npm start`
     - **Instance Type:** Free

4. **Add Environment Variables**
   - In Render dashboard, go to "Environment"
   - Add all variables from your `.env` file
   - Update `BASE_URL` to your Render URL (e.g., `https://agrivision-backend.onrender.com`)

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (3-5 minutes)

6. **Your API is live!**
   - Access at: `https://agrivision-backend.onrender.com/api`

---

## Option 2: Railway

**Pros:** Free $5 credit/month, easy setup, great developer experience  
**Cons:** Free tier limits

### Steps:

1. **Push code to GitHub** (same as above)

2. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

3. **Deploy from GitHub**
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Railway auto-detects Node.js

4. **Add Environment Variables**
   - Click on your service → "Variables"
   - Add all environment variables
   - Railway provides `PORT` automatically

5. **Generate Domain**
   - Go to "Settings" → "Networking"
   - Click "Generate Domain"
   - Update `BASE_URL` with your Railway domain

6. **Deploy**
   - Automatic deployment starts
   - Monitor logs in dashboard

---

## Option 3: Heroku

**Pros:** Well-documented, reliable  
**Cons:** No free tier anymore (starts at $5/month)

### Steps:

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Login and Create App**
   ```bash
   heroku login
   heroku create agrivision-backend
   ```

3. **Add Environment Variables**
   ```bash
   heroku config:set MONGO_URI="your_connection_string"
   heroku config:set JWT_SECRET="your_secret"
   heroku config:set EMAIL_USER="your_email"
   heroku config:set EMAIL_PASS="your_password"
   heroku config:set BASE_URL="https://agrivision-backend.herokuapp.com"
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

5. **View Logs**
   ```bash
   heroku logs --tail
   ```

---

## Option 4: DigitalOcean App Platform

**Pros:** Professional, scalable  
**Cons:** Starts at $5/month

### Steps:

1. **Create DigitalOcean Account**
   - Go to [digitalocean.com](https://digitalocean.com)
   - Sign up (get $200 credit for 60 days with student/startup programs)

2. **Create New App**
   - Go to "Apps" → "Create App"
   - Connect GitHub repository

3. **Configure App**
   - Detected as Node.js
   - Build Command: `npm install`
   - Run Command: `npm start`

4. **Add Environment Variables**
   - In "Environment Variables" section
   - Add all variables from `.env`

5. **Deploy**
   - Click "Create Resources"
   - Wait for deployment

---

## Option 5: VPS (Ubuntu Server)

**Pros:** Full control, best performance  
**Cons:** Requires server management knowledge

### Using DigitalOcean Droplet ($6/month):

1. **Create Droplet**
   - OS: Ubuntu 22.04 LTS
   - Plan: Basic ($6/month)

2. **Connect via SSH**
   ```bash
   ssh root@your_server_ip
   ```

3. **Install Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   sudo apt-get install -y git
   ```

4. **Install PM2 (Process Manager)**
   ```bash
   sudo npm install -g pm2
   ```

5. **Clone Your Repository**
   ```bash
   git clone https://github.com/yourusername/agrivision-backend.git
   cd agrivision-backend
   ```

6. **Install Dependencies**
   ```bash
   npm install
   ```

7. **Create Environment File**
   ```bash
   nano .env
   ```
   Paste your environment variables and save (Ctrl+X, Y, Enter)

8. **Start with PM2**
   ```bash
   pm2 start server.js --name agrivision-backend
   pm2 startup
   pm2 save
   ```

9. **Setup Nginx as Reverse Proxy**
   ```bash
   sudo apt-get install -y nginx
   sudo nano /etc/nginx/sites-available/agrivision
   ```

   Add this configuration:
   ```nginx
   server {
       listen 80;
       server_name your_domain.com;

       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   ```bash
   sudo ln -s /etc/nginx/sites-available/agrivision /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

10. **Setup SSL with Certbot (HTTPS)**
    ```bash
    sudo apt-get install -y certbot python3-certbot-nginx
    sudo certbot --nginx -d your_domain.com
    ```

11. **Setup Firewall**
    ```bash
    sudo ufw allow 'Nginx Full'
    sudo ufw allow OpenSSH
    sudo ufw enable
    ```

---

## Post-Deployment

### 1. **Test Your API**
```bash
# Test health endpoint
curl https://your-api-url.com/api/auth/login

# Test with actual data
curl -X POST https://your-api-url.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456"}'
```

### 2. **Monitor Logs**
- **Render:** Check dashboard logs
- **Railway:** Check deployment logs
- **Heroku:** `heroku logs --tail`
- **VPS:** `pm2 logs agrivision-backend`

### 3. **Update Frontend**
Update your mobile app's API base URL to point to production:
```javascript
const API_BASE_URL = 'https://your-api-url.com/api';
```

### 4. **Setup Monitoring** (Optional)
- Add error tracking: [Sentry](https://sentry.io)
- Add uptime monitoring: [UptimeRobot](https://uptimerobot.com) (free)

### 5. **Database Backup**
- Your MongoDB Atlas already has automatic backups
- Consider setting up additional backup schedule in MongoDB Atlas

---

## Troubleshooting

### Issue: "Application Error" or 500 errors
**Solution:** Check logs for missing environment variables

### Issue: CORS errors from mobile app
**Solution:** Update CORS settings in `src/app.js` to include production domain

### Issue: MongoDB connection failed
**Solution:** 
- Check MongoDB Atlas network access (allow 0.0.0.0/0 for production)
- Verify connection string is correct
- Check database user permissions

### Issue: Email not sending
**Solution:** 
- Verify Gmail App Password is correct
- Check "Less secure app access" settings
- Consider using SendGrid for production emails

---

## Recommended: Render (Free Option)

For your project, I recommend **Render** because:
✅ Completely free tier  
✅ Easy setup (10 minutes)  
✅ Auto-deploys from Git  
✅ HTTPS included  
✅ Good for MVP/testing  

You can always migrate to a paid service later as your app grows.

---

## Need Help?

If you encounter any issues during deployment, check:
1. Deployment platform logs
2. MongoDB Atlas network access settings
3. Environment variables are correctly set
4. Node.js version compatibility (you're using modern packages)

Happy deploying! 🚀
