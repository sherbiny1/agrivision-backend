# 📱 AgriVision Backend API - For Flutter Developer

## 🌐 API Base URL

Once deployed, your backend API will be available at:

```
https://YOUR-APP-NAME.onrender.com/api
```

Replace `YOUR-APP-NAME` with the actual app name after deployment.

---

## 🔧 Flutter Integration Steps

### 1. Update API Configuration

In your Flutter project, update the API base URL:

**Option A: Using a constants file (Recommended)**

Create/Update `lib/constants/api_constants.dart`:

```dart
class ApiConstants {
  // Production API
  static const String baseUrl = 'https://YOUR-APP-NAME.onrender.com/api';
  
  // Alternative: Use environment-based URLs
  static const String devBaseUrl = 'http://localhost:5000/api';
  static const String prodBaseUrl = 'https://YOUR-APP-NAME.onrender.com/api';
  
  // Use this based on environment
  static String get apiUrl => prodBaseUrl; // Change to devBaseUrl for local testing
  
  // Endpoints
  static const String login = '/auth/login';
  static const String register = '/auth/register';
  static const String farmerHome = '/farmer/home';
  static const String scanPlant = '/farmer/scan-plant';
  static const String diagnoses = '/farmer/diagnoses';
  static const String farmData = '/farmer/farm-data';
  static const String recommendations = '/farmer/recommendations';
  static const String notifications = '/farmer/notifications';
  static const String knowledgeBase = '/farmer/knowledge-base';
}
```

**Option B: Using .env file**

If using flutter_dotenv package:

```env
# .env
API_BASE_URL=https://YOUR-APP-NAME.onrender.com/api
```

```dart
// In your code
import 'package:flutter_dotenv/flutter_dotenv.dart';

final apiBaseUrl = dotenv.env['API_BASE_URL'] ?? '';
```

---

### 2. Update HTTP Service

Example with `http` package:

```dart
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'api_constants.dart';

class ApiService {
  // Login example
  Future<Map<String, dynamic>> login(String email, String password) async {
    final url = Uri.parse('${ApiConstants.apiUrl}${ApiConstants.login}');
    
    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'email': email,
        'password': password,
      }),
    );
    
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Login failed: ${response.body}');
    }
  }
  
  // Authenticated request example
  Future<Map<String, dynamic>> getFarmerHome(String token) async {
    final url = Uri.parse('${ApiConstants.apiUrl}${ApiConstants.farmerHome}');
    
    final response = await http.get(
      url,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    );
    
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to load data: ${response.body}');
    }
  }
  
  // Upload image example
  Future<Map<String, dynamic>> scanPlant(String token, String imagePath) async {
    final url = Uri.parse('${ApiConstants.apiUrl}${ApiConstants.scanPlant}');
    
    var request = http.MultipartRequest('POST', url);
    request.headers['Authorization'] = 'Bearer $token';
    request.files.add(await http.MultipartFile.fromPath('image', imagePath));
    
    final streamedResponse = await request.send();
    final response = await http.Response.fromStream(streamedResponse);
    
    if (response.statusCode == 201) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Scan failed: ${response.body}');
    }
  }
}
```

Example with `dio` package (better for complex apps):

```dart
import 'package:dio/dio.dart';
import 'api_constants.dart';

class ApiService {
  late Dio _dio;
  
  ApiService() {
    _dio = Dio(BaseOptions(
      baseUrl: ApiConstants.apiUrl,
      connectTimeout: Duration(seconds: 30),
      receiveTimeout: Duration(seconds: 30),
      headers: {
        'Content-Type': 'application/json',
      },
    ));
    
    // Add interceptor for logging
    _dio.interceptors.add(LogInterceptor(
      requestBody: true,
      responseBody: true,
    ));
  }
  
  // Set token after login
  void setAuthToken(String token) {
    _dio.options.headers['Authorization'] = 'Bearer $token';
  }
  
  // Login
  Future<Map<String, dynamic>> login(String email, String password) async {
    try {
      final response = await _dio.post(
        ApiConstants.login,
        data: {'email': email, 'password': password},
      );
      return response.data;
    } catch (e) {
      throw Exception('Login failed: $e');
    }
  }
  
  // Get farmer home
  Future<Map<String, dynamic>> getFarmerHome() async {
    try {
      final response = await _dio.get(ApiConstants.farmerHome);
      return response.data;
    } catch (e) {
      throw Exception('Failed to load home: $e');
    }
  }
  
  // Upload image
  Future<Map<String, dynamic>> scanPlant(String imagePath) async {
    try {
      FormData formData = FormData.fromMap({
        'image': await MultipartFile.fromFile(imagePath),
      });
      
      final response = await _dio.post(
        ApiConstants.scanPlant,
        data: formData,
      );
      return response.data;
    } catch (e) {
      throw Exception('Scan failed: $e');
    }
  }
}
```

---

### 3. Handle Authentication

Store the token after login:

```dart
import 'package:shared_preferences/shared_preferences.dart';

class AuthService {
  static const String _tokenKey = 'auth_token';
  
  // Save token
  Future<void> saveToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_tokenKey, token);
  }
  
  // Get token
  Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_tokenKey);
  }
  
  // Remove token (logout)
  Future<void> removeToken() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_tokenKey);
  }
  
  // Check if logged in
  Future<bool> isLoggedIn() async {
    final token = await getToken();
    return token != null && token.isNotEmpty;
  }
}
```

---

### 4. Complete Login Flow Example

```dart
import 'package:flutter/material.dart';

class LoginScreen extends StatefulWidget {
  @override
  _LoginScreenState createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _apiService = ApiService();
  final _authService = AuthService();
  bool _isLoading = false;
  
  Future<void> _handleLogin() async {
    setState(() => _isLoading = true);
    
    try {
      final response = await _apiService.login(
        _emailController.text,
        _passwordController.text,
      );
      
      // Save token
      await _authService.saveToken(response['token']);
      
      // Set token for future requests
      _apiService.setAuthToken(response['token']);
      
      // Navigate to home
      Navigator.pushReplacementNamed(context, '/home');
      
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Login failed: $e')),
      );
    } finally {
      setState(() => _isLoading = false);
    }
  }
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Login')),
      body: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          children: [
            TextField(
              controller: _emailController,
              decoration: InputDecoration(labelText: 'Email'),
              keyboardType: TextInputType.emailAddress,
            ),
            SizedBox(height: 16),
            TextField(
              controller: _passwordController,
              decoration: InputDecoration(labelText: 'Password'),
              obscureText: true,
            ),
            SizedBox(height: 24),
            _isLoading
                ? CircularProgressIndicator()
                : ElevatedButton(
                    onPressed: _handleLogin,
                    child: Text('Login'),
                  ),
          ],
        ),
      ),
    );
  }
}
```

---

## 🐛 Common Errors & Solutions

### Error 1: "SocketException: Failed host lookup"
**Cause:** Wrong API URL or no internet connection  
**Solution:**
- Check the API base URL is correct
- Ensure device has internet connection
- For Android emulator, use `10.0.2.2:5000` for localhost (not applicable for deployed API)

### Error 2: "FormatException: Unexpected character"
**Cause:** Response is not valid JSON  
**Solution:**
- Check API endpoint is correct
- Print response body to see actual error message
- Backend might be returning HTML error page

```dart
print('Response status: ${response.statusCode}');
print('Response body: ${response.body}');
```

### Error 3: "401 Unauthorized"
**Cause:** Missing or invalid token  
**Solution:**
- Ensure token is included in headers: `'Authorization': 'Bearer $token'`
- Check token is saved correctly after login
- Token might be expired - re-login

### Error 4: "Connection timeout"
**Cause:** Render free tier cold start (first request takes ~30 seconds)  
**Solution:**
- Increase timeout in dio/http configuration:
```dart
BaseOptions(
  connectTimeout: Duration(seconds: 60),
  receiveTimeout: Duration(seconds: 60),
)
```

### Error 5: "CORS error" (Web only)
**Cause:** Backend CORS not allowing web requests  
**Solution:** Backend already has CORS enabled, but ensure you're using HTTPS in production

### Error 6: "Certificate verification failed" (HTTPS)
**Cause:** SSL certificate issues  
**Solution:** For development only (NOT production):
```dart
// ⚠️ Development only!
import 'dart:io';

class MyHttpOverrides extends HttpOverrides {
  @override
  HttpClient createHttpClient(SecurityContext? context) {
    return super.createHttpClient(context)
      ..badCertificateCallback = (X509Certificate cert, String host, int port) => true;
  }
}

void main() {
  HttpOverrides.global = MyHttpOverrides();
  runApp(MyApp());
}
```

---

## 📦 Required Packages

Add these to your `pubspec.yaml`:

```yaml
dependencies:
  # HTTP requests
  http: ^1.1.0
  # OR use dio (recommended)
  dio: ^5.4.0
  
  # Store token
  shared_preferences: ^2.2.2
  
  # Optional: Environment variables
  flutter_dotenv: ^5.1.0
  
  # Optional: State management
  provider: ^6.1.1
  # OR
  riverpod: ^2.4.9
```

---

## 🧪 Testing the Connection

Create a simple test screen:

```dart
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class ApiTestScreen extends StatefulWidget {
  @override
  _ApiTestScreenState createState() => _ApiTestScreenState();
}

class _ApiTestScreenState extends State<ApiTestScreen> {
  String _status = 'Not tested';
  
  Future<void> _testConnection() async {
    setState(() => _status = 'Testing...');
    
    try {
      final url = Uri.parse('https://YOUR-APP-NAME.onrender.com/');
      final response = await http.get(url).timeout(Duration(seconds: 60));
      
      setState(() {
        _status = 'Success!\nStatus: ${response.statusCode}\nBody: ${response.body}';
      });
    } catch (e) {
      setState(() => _status = 'Error: $e');
    }
  }
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('API Connection Test')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(_status),
            SizedBox(height: 20),
            ElevatedButton(
              onPressed: _testConnection,
              child: Text('Test Connection'),
            ),
          ],
        ),
      ),
    );
  }
}
```

---

## 📝 API Endpoints Reference

See `API_DOCUMENTATION.md` for complete API reference.

**Quick Reference:**

```dart
// Auth (no token required)
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/forgot-password
POST   /api/auth/verify-code
POST   /api/auth/reset-password

// Farmer (token required)
GET    /api/farmer/home
POST   /api/farmer/scan-plant          // multipart/form-data
GET    /api/farmer/diagnoses
POST   /api/farmer/farm-data
GET    /api/farmer/recommendations
GET    /api/farmer/notifications
GET    /api/farmer/knowledge-base
PUT    /api/farmer/settings/language

// Agronomist (token required)
GET    /api/agronomist/diagnoses/pending
PUT    /api/agronomist/diagnoses/:id/validate

// Admin (token required)
GET    /api/admin/users
DELETE /api/admin/users/:id
GET    /api/admin/system-stats
```

---

## ✅ Checklist for Flutter Developer

- [ ] Update API base URL to production URL
- [ ] Add required packages (http/dio, shared_preferences)
- [ ] Implement API service with proper error handling
- [ ] Handle authentication (token storage)
- [ ] Test login/register flows
- [ ] Test image upload (scan plant feature)
- [ ] Handle timeout for Render cold starts (60 seconds)
- [ ] Add loading indicators for API calls
- [ ] Test on physical device (not just emulator)
- [ ] Handle offline scenarios gracefully

---

## 🚀 Production URL

**Backend Developer:** After deployment, update this file with the actual URL:

```
Production API URL: https://_____________________.onrender.com/api
```

**Deployed on:** ___/___/2026

**Status:** ⚠️ Pending deployment

---

## 📞 Support

If you encounter any issues:
1. Check the API is accessible (visit the URL in browser)
2. Check your internet connection
3. Verify token is being sent correctly
4. Check API documentation for correct request format
5. Contact backend developer with error details

**Important:** First request after 15 minutes of inactivity takes ~30 seconds (Render free tier cold start). This is normal!

---

**Happy coding! 🌱**
