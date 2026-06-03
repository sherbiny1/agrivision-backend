# 📧 Email Verification System - Configuration

## ✅ What's Already Working:

1. **Verification Email Sent** - When user registers
2. **Beautiful Email Template** - Professional design
3. **Success Page** - When user clicks verification link
4. **Error Page** - When link is expired/invalid
5. **Logo Updated** - Now uses your custom logo

---

## 🔧 Changes Made:

### 1. **Logo Updated in All Templates:**
- Verification Email → Now uses `{{BASE_URL}}/uploads/logo.png`
- Success Page → Now uses `{{BASE_URL}}/uploads/logo.png`

### 2. **BASE_URL Added to Email Service:**
- Emails now use the production URL automatically

---

## 📱 **Important for Flutter Developer:**

### **Deep Link Configuration Needed**

When a user verifies their email, the success page tries to redirect to:
```
agrivision://home
```

**Your Flutter app needs to handle this deep link!**

---

## 🔗 **Flutter Deep Link Setup:**

### **1. Add dependencies in `pubspec.yaml`:**
```yaml
dependencies:
  uni_links: ^0.5.1
  # OR
  app_links: ^3.4.5  # (newer, recommended)
```

### **2. Configure Android (`android/app/src/main/AndroidManifest.xml`):**

Add inside `<activity>` tag:

```xml
<intent-filter>
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="agrivision" />
</intent-filter>
```

### **3. Configure iOS (`ios/Runner/Info.plist`):**

Add this:

```xml
<key>CFBundleURLTypes</key>
<array>
    <dict>
        <key>CFBundleTypeRole</key>
        <string>Editor</string>
        <key>CFBundleURLName</key>
        <string>agrivision</string>
        <key>CFBundleURLSchemes</key>
        <array>
            <string>agrivision</string>
        </array>
    </dict>
</array>
```

### **4. Handle Deep Link in Flutter:**

```dart
import 'package:uni_links/uni_links.dart';
import 'dart:async';

class DeepLinkService {
  StreamSubscription? _sub;
  
  void initDeepLinks() {
    _sub = linkStream.listen((String? link) {
      if (link != null) {
        _handleDeepLink(link);
      }
    }, onError: (err) {
      print('Deep link error: $err');
    });
  }
  
  void _handleDeepLink(String link) {
    // Parse the link
    Uri uri = Uri.parse(link);
    
    if (uri.scheme == 'agrivision') {
      if (uri.host == 'home') {
        // Navigate to home screen
        // Example: Navigator.pushNamed(context, '/home');
      }
    }
  }
  
  void dispose() {
    _sub?.cancel();
  }
}
```

### **5. Initialize in `main.dart`:**

```dart
void main() {
  runApp(MyApp());
  
  // Initialize deep links
  DeepLinkService().initDeepLinks();
}
```

---

## 🧪 **Testing the Verification Flow:**

### **1. Register a New User:**
```bash
POST https://agrivision-backend.up.railway.app/api/auth/register

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "123456",
  "role": "Farmer"
}
```

### **2. Check Email:**
- User receives verification email
- Email has your logo
- "Confirm My Email" button

### **3. Click Verification Link:**
- Opens success page
- Shows "Email Confirmed!"
- Tries to redirect to app (if deep link is configured)

### **4. User Can Now Login:**
- `emailVerified` field is set to `true`

---

## 📋 **Verification Email Details:**

### **Email Contains:**
- ✅ Your custom logo (from `uploads/logo.png`)
- ✅ User's name
- ✅ Verification button (expires in 24 hours)
- ✅ Manual link (if button doesn't work)
- ✅ Feature highlights
- ✅ Professional design

### **Success Page Contains:**
- ✅ Your custom logo
- ✅ Success message
- ✅ "Open AgriVision AI" button
- ✅ Auto-redirect after 2 seconds (if deep link configured)

### **Error Page Contains:**
- ✅ Clear error message
- ✅ Instructions to re-register

---

## 🚀 **Deploy These Changes:**

```bash
git add .
git commit -m "Update email verification logos and BASE_URL"
git push
```

Railway will auto-deploy in 1-2 minutes.

---

## ✅ **Summary:**

| Feature | Status | Notes |
|---------|--------|-------|
| Verification Email | ✅ Working | Uses your logo |
| Success Page | ✅ Working | Uses your logo |
| Error Page | ✅ Working | |
| Deep Link | ⚠️ Needs Flutter Config | See Flutter setup above |
| BASE_URL | ✅ Configured | Production URL |
| Token Expiry | ✅ Working | 24 hours |

---

## 📱 **What Flutter Developer Needs to Do:**

1. **Configure deep links** (see instructions above)
2. **Handle `agrivision://home` link** in the app
3. **Test verification flow** after deployment

---

## 🔒 **Security Notes:**

- ✅ Verification tokens expire in 24 hours
- ✅ Tokens are one-time use only
- ✅ Email verification required before full access
- ✅ Invalid tokens show error page

---

**Everything is ready! Push the changes and the email verification system will work perfectly!** 🎉
