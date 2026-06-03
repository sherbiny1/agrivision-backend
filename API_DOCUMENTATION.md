# AgriVision AI — Backend API Documentation

## Base URL
```
http://YOUR_IP_ADDRESS:5000/api
```
> Replace `YOUR_IP_ADDRESS` with the backend developer's IP address (run `ipconfig` to find it).
> Both devices must be on the same Wi-Fi network.

---

## Authentication
All protected routes require a Bearer token in the request header:
```
Authorization: Bearer YOUR_TOKEN_HERE
```
You get this token from the Login or Register response.

---

## 🔐 AUTH ENDPOINTS — No token required

### 1. Register
| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/api/auth/register` |
| **Access** | Public |

**Request Body:**
```json
{
  "name": "Ahmed Mohamed",
  "email": "ahmed@test.com",
  "password": "123456",
  "role": "Farmer"
}
```
> `role` options: `"Farmer"` | `"Agronomist"` | `"Admin"`

**Success Response (201):**
```json
{
  "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
  "name": "Ahmed Mohamed",
  "email": "ahmed@test.com",
  "role": "Farmer",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 2. Login
| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/api/auth/login` |
| **Access** | Public |

**Request Body:**
```json
{
  "email": "ahmed@test.com",
  "password": "123456"
}
```

**Success Response (200):**
```json
{
  "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
  "name": "Ahmed Mohamed",
  "email": "ahmed@test.com",
  "role": "Farmer",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 3. Forgot Password
| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/api/auth/forgot-password` |
| **Access** | Public |

**Request Body:**
```json
{
  "email": "ahmed@test.com"
}
```

**Success Response (200):**
```json
{
  "message": "Verification code sent to email"
}
```

---

### 4. Verify Code
| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/api/auth/verify-code` |
| **Access** | Public |

**Request Body:**
```json
{
  "email": "ahmed@test.com",
  "code": "1234"
}
```

**Success Response (200):**
```json
{
  "message": "Code verified successfully"
}
```

---

### 5. Reset Password
| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/api/auth/reset-password` |
| **Access** | Public |

**Request Body:**
```json
{
  "email": "ahmed@test.com",
  "code": "1234",
  "newPassword": "newpass123"
}
```

**Success Response (200):**
```json
{
  "message": "Password reset successful"
}
```

---

## 🌱 FARMER ENDPOINTS — Token required (Farmer role)

### 6. Home Dashboard
| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/api/farmer/home` |
| **Access** | Farmer only |

**No body required.**

**Success Response (200):**
```json
{
  "user": { "name": "Ahmed Mohamed" },
  "weather": {
    "temp": 23,
    "condition": "Partly Cloudy",
    "humidity": 10,
    "wind": 12
  },
  "stats": {
    "totalTests": 5,
    "averageSatisfied": 70
  },
  "dailyTasks": [],
  "notifications": []
}
```

---

### 7. Scan Plant (Upload Image)
| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/api/farmer/scan-plant` |
| **Access** | Farmer only |
| **Content-Type** | `multipart/form-data` |

**Request Body (Form Data):**
```
Key: image
Value: [select image file]
Type: File
```

**Success Response (201):**
```json
{
  "_id": "64f1a2b3c4d5e6f7a8b9c0d2",
  "farmerId": "64f1a2b3c4d5e6f7a8b9c0d1",
  "imageUrl": "/uploads/1713945600-leaf.jpg",
  "scanScore": 92,
  "healthStatus": "Unhealthy",
  "pests": [
    { "name": "Snails and Slugs", "percentage": 5 },
    { "name": "Whiteflies", "percentage": 10 },
    { "name": "Thrips", "percentage": 5 },
    { "name": "Ant", "percentage": 5 }
  ],
  "diseases": [
    { "name": "Leaf Spots", "percentage": 50 },
    { "name": "Mosaic virus", "percentage": 10 },
    { "name": "Rot", "percentage": 5 }
  ],
  "wiltsPercentage": 3,
  "leafSpotsPercentage": 70,
  "pestTreatment": {
    "currentRate": 15,
    "futureGrowth": 85,
    "recommendations": [
      "Remove heavily infested leaves",
      "Wash the plant gently with clean water",
      "Apply a natural pest treatment"
    ]
  },
  "diseaseTreatment": {
    "currentRate": 10,
    "futureGrowth": 90,
    "recommendations": [
      "Isolate the plant to stop disease spread",
      "Keep the plant dry and well ventilated",
      "Apply the recommended disease treatment"
    ]
  },
  "status": "Pending"
}
```

---

### 8. Get All Diagnoses
| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/api/farmer/diagnoses` |
| **Access** | Farmer only |

**No body required.**

**Success Response (200):** Array of diagnosis objects (same structure as scan response above).

---

### 9. Submit Soil Test Survey
| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/api/farmer/farm-data` |
| **Access** | Farmer only |

**Request Body:**
```json
{
  "soilFeel": "Smooth and sticky",
  "soilWetness": "Slightly wet",
  "soilColor": "Dark brown",
  "soilSmell": "Fresh earthy smell",
  "plantLook": "Leaves are yellow",
  "previousCrop": "Tomato"
}
```

**Success Response (201):**
```json
{
  "farmData": {
    "_id": "...",
    "soilMoisture": "Medium",
    "soilMoisturePercentage": 60,
    "soilFertility": "Good",
    "soilFertilityPercentage": 75,
    "drainageQuality": 55,
    "nutrientLevel": "Medium",
    "phLevel": 6.5
  },
  "recommendation": {
    "moistureTips": { "current": 40, "goal": 60, "tips": [...] },
    "fertilizationTips": { "current": 30, "recommended": 70, "tips": [...] },
    "recommendedCrops": [...],
    "irrigationDashboard": {...},
    "dailyTasks": [...]
  }
}
```

---

### 10. Get Recommendations
| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/api/farmer/recommendations` |
| **Access** | Farmer only |

**No body required.**

**Success Response (200):** Array of recommendation objects.

---

### 11. Get Notifications
| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/api/farmer/notifications` |
| **Access** | Farmer only |

**No body required.**

**Success Response (200):**
```json
[
  {
    "_id": "...",
    "title": "Weather Update",
    "body": "Today's weather is very Rainy",
    "isRead": false,
    "date": "2026-04-27T03:58:30.672Z"
  }
]
```

---

### 12. Get Knowledge Base
| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/api/farmer/knowledge-base` |
| **Access** | Farmer only |

**No body required.**

**Success Response (200):**
```json
[
  {
    "_id": "...",
    "title": "Jasmin Flower",
    "daysAgo": "2 Days Ago",
    "content": "..."
  }
]
```

---

### 13. Update Language
| | |
|---|---|
| **Method** | `PUT` |
| **URL** | `/api/farmer/settings/language` |
| **Access** | Farmer only |

**Request Body:**
```json
{
  "language": "ar"
}
```

**Success Response (200):**
```json
{
  "message": "Language updated",
  "language": "ar"
}
```

---

## 🧑‍🔬 AGRONOMIST ENDPOINTS — Token required (Agronomist role)

### 14. Get Pending Diagnoses
| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/api/agronomist/diagnoses/pending` |
| **Access** | Agronomist only |

**No body required.**

**Success Response (200):** Array of pending diagnosis objects with farmer info populated.

---

### 15. Validate Diagnosis
| | |
|---|---|
| **Method** | `PUT` |
| **URL** | `/api/agronomist/diagnoses/:id/validate` |
| **Access** | Agronomist only |

**Request Body:**
```json
{
  "treatmentAdvice": "Apply copper-based fungicide. Water every 2 days. Remove infected leaves."
}
```

**Success Response (200):** Updated diagnosis object with `status: "Validated"`.

---

## 🛠️ ADMIN ENDPOINTS — Token required (Admin role)

### 16. Get All Users
| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/api/admin/users` |
| **Access** | Admin only |

**No body required.**

**Success Response (200):** Array of user objects (passwords excluded).

---

### 17. Delete User
| | |
|---|---|
| **Method** | `DELETE` |
| **URL** | `/api/admin/users/:id` |
| **Access** | Admin only |

**No body required. Replace `:id` with user's `_id`.**

**Success Response (200):**
```json
{
  "message": "User removed"
}
```

---

### 18. System Stats
| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/api/admin/system-stats` |
| **Access** | Admin only |

**No body required.**

**Success Response (200):**
```json
{
  "users": 10,
  "diagnoses": {
    "total": 25,
    "pending": 5,
    "validated": 20
  },
  "farmDataEntries": 15
}
```

---

## ❌ Error Responses

| Status Code | Meaning |
|---|---|
| `400` | Bad request — missing or invalid fields |
| `401` | Unauthorized — no token or invalid token |
| `403` | Forbidden — wrong role for this route |
| `404` | Not found — resource doesn't exist |
| `500` | Server error |

**Error Response Format:**
```json
{
  "message": "Error description here"
}
```
