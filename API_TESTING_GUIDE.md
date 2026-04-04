# 🧪 Complete API Testing Guide
## Muthokinju Warehouse Management System

**Last Updated**: April 4, 2026  
**System Status**: Ready for Testing  
**Backend URL**: https://muthokinju-warehouse-management-system.onrender.com/api

---

## 📋 Quick Reference

### Base Information
- **API Base URL**: `https://muthokinju-warehouse-management-system.onrender.com/api`
- **Authentication**: JWT Bearer Token (obtained via login)
- **Default Headers**: `Content-Type: application/json`
- **Token Key**: `Authorization: Bearer <token>`

---

## 🔐 1. Authentication Flow

### Step 1: Register User
```
POST /auth/register
```
**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass@123",
  "role": "Sales Staff",
  "department": "Warehouse"
}
```

**Expected Response (201 Created):**
```json
{
  "user": {
    "_id": "user123",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Sales Staff",
    "department": "Warehouse",
    "isActive": true
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### Step 2: Login
```
POST /auth/login
```
**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass@123"
}
```

**Expected Response (200 OK):**
```json
{
  "user": {
    "_id": "user123",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Sales Staff",
    "department": "Warehouse",
    "isActive": true
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**✅ ACTION**: Save this token! You'll need it for all subsequent requests.

---

### Step 3: Get Current User Profile
```
GET /auth/profile
Headers: Authorization: Bearer {token}
```

**Expected Response (200 OK):**
```json
{
  "_id": "user123",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "Sales Staff",
  "department": "Warehouse",
  "isActive": true
}
```

---

### Step 4: Logout
```
POST /auth/logout
Headers: Authorization: Bearer {token}
```

**Expected Response (200 OK):**
```json
{
  "message": "Logged out successfully"
}
```

---

## 📦 2. Order Management

### Get All Orders
```
GET /orders
Headers: Authorization: Bearer {token}
```

**Expected Response (200 OK):**
```json
[
  {
    "_id": "order123",
    "orderNumber": "ORD-001",
    "customer": {
      "name": "Acme Corp",
      "email": "contact@acme.com",
      "phone": "+1234567890",
      "address": "123 Main St"
    },
    "items": [
      {
        "sku": "SKU001",
        "productName": "Product 1",
        "quantity": 10,
        "unitPrice": 100
      }
    ],
    "orderStatus": "pending",
    "totalAmount": 1000,
    "createdAt": "2026-04-04T10:00:00Z"
  }
]
```

---

### Create Order
```
POST /orders
Headers: Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "orderNumber": "ORD-002",
  "customer": {
    "name": "Acme Corp",
    "email": "contact@acme.com",
    "phone": "+1234567890",
    "address": "123 Main St"
  },
  "items": [
    {
      "sku": "SKU001",
      "productName": "Product 1",
      "quantity": 10,
      "unitPrice": 100
    }
  ],
  "totalAmount": 1000,
  "notes": "Urgent delivery"
}
```

**Expected Response (201 Created):**
```json
{
  "_id": "order123",
  "orderNumber": "ORD-002",
  "customer": {...},
  "items": [...],
  "orderStatus": "pending",
  "totalAmount": 1000,
  "createdAt": "2026-04-04T10:00:00Z"
}
```

---

### Get My Orders (Sales Staff)
```
GET /orders/my-orders
Headers: Authorization: Bearer {token}
```

**Expected Response (200 OK):**
```json
[
  {order objects created by current user}
]
```

---

### Get Order by ID
```
GET /orders/{orderId}
Headers: Authorization: Bearer {token}
```

**Expected Response (200 OK):**
```json
{
  "order details as above"
}
```

---

### Update Order
```
PATCH /orders/{orderId}
Headers: Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "totalAmount": 1200,
  "notes": "Updated notes"
}
```

**Expected Response (200 OK)**: Updated order object

---

### Cancel Order
```
DELETE /orders/{orderId}
Headers: Authorization: Bearer {token}
```

**Expected Response (200 OK):**
```json
{
  "message": "Order cancelled successfully",
  "orderId": "order123"
}
```

---

## 📊 3. Inventory Management

### Get All Inventory Items
```
GET /inventory
Headers: Authorization: Bearer {token}
```

**Expected Response (200 OK):**
```json
[
  {
    "_id": "inv123",
    "sku": "SKU001",
    "productName": "Product 1",
    "quantity": 100,
    "unitPrice": 100,
    "reorderLevel": 20,
    "storageLocation": "A-1-01",
    "lastStockCheck": "2026-04-04T10:00:00Z"
  }
]
```

---

### Get Item by SKU
```
GET /inventory/{sku}
Headers: Authorization: Bearer {token}
```

**Expected Response (200 OK)**: Single inventory item object

---

### Create Inventory Item
```
POST /inventory
Headers: Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "sku": "SKU002",
  "productName": "Product 2",
  "quantity": 50,
  "unitPrice": 150,
  "reorderLevel": 10,
  "storageLocation": "B-2-01"
}
```

**Expected Response (201 Created)**: Inventory item object

---

### Update Inventory Item
```
PATCH /inventory/{sku}
Headers: Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "quantity": 75,
  "storageLocation": "B-3-01"
}
```

**Expected Response (200 OK)**: Updated inventory item

---

### Delete Inventory Item
```
DELETE /inventory/{sku}
Headers: Authorization: Bearer {token}
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Inventory item deleted"
}
```

---

## 📥 4. Receiving Management

### Get All Receiving Documents
```
GET /receiving
Headers: Authorization: Bearer {token}
```

**Expected Response (200 OK):**
```json
[
  {
    "_id": "rcv123",
    "receivingNumber": "RCV-001",
    "supplier": {
      "name": "Supplier Inc",
      "contact": "+9876543210",
      "email": "supplier@inc.com"
    },
    "purchaseOrder": "PO-001",
    "items": [
      {
        "sku": "SKU001",
        "productName": "Product 1",
        "expectedQuantity": 100,
        "recipientQuantity": 100,
        "batchNumber": "BATCH001",
        "manufactureDate": "2026-04-01",
        "expiryDate": "2027-04-01",
        "storageLocationCode": "A-1-01"
      }
    ],
    "status": "pending",
    "createdAt": "2026-04-04T10:00:00Z"
  }
]
```

---

### Create Receiving Document
```
POST /receiving
Headers: Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "receivingNumber": "RCV-002",
  "supplier": {
    "name": "Supplier Inc",
    "contact": "+9876543210",
    "email": "supplier@inc.com"
  },
  "purchaseOrder": "PO-002",
  "items": [
    {
      "sku": "SKU001",
      "productName": "Product 1",
      "expectedQuantity": 100,
      "batchNumber": "BATCH002",
      "manufactureDate": "2026-04-01",
      "expiryDate": "2027-04-01",
      "storageLocationCode": "A-1-01"
    }
  ]
}
```

**Expected Response (201 Created)**: Receiving document object

---

### Update Received Quantities
```
PATCH /receiving/{receivingId}/update-quantities
Headers: Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "items": [
    {
      "sku": "SKU001",
      "receivedQuantity": 95
    }
  ]
}
```

**Expected Response (200 OK)**: Updated receiving document

---

### Accept Receiving (Updates Inventory)
```
PATCH /receiving/{receivingId}/accept
Headers: Authorization: Bearer {token}
```

**Expected Response (200 OK):**
```json
{
  "message": "Receiving accepted, inventory updated",
  "receivingId": "rcv123"
}
```

---

### Reject Receiving
```
PATCH /receiving/{receivingId}/reject
Headers: Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "rejectionReason": "Quality check failed - defective units"
}
```

**Expected Response (200 OK):**
```json
{
  "message": "Receiving rejected",
  "receivingId": "rcv123"
}
```

---

## 🚚 5. Picking & Packing

### Get Items Ready for Picking
```
GET /picking
Headers: Authorization: Bearer {token}
```

**Expected Response (200 OK)**: List of orders ready for picking

---

### Mark Items as Picked
```
PATCH /picking/{orderId}/mark-picked
Headers: Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "pickedItems": [
    {
      "sku": "SKU001",
      "quantity": 10
    }
  ]
}
```

**Expected Response (200 OK)**: Updated order with picking status

---

### Get Items Ready for Packing
```
GET /packing
Headers: Authorization: Bearer {token}
```

**Expected Response (200 OK)**: List of orders ready for packing

---

### Confirm Packed Items
```
PATCH /packing/{orderId}/confirm
Headers: Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "packedItems": [
    {
      "sku": "SKU001",
      "quantity": 10
    }
  ]
}
```

**Expected Response (200 OK)**: Updated order with packing confirmed

---

## 🚛 6. Dispatch & Delivery

### Get Orders Ready for Dispatch
```
GET /dispatch
Headers: Authorization: Bearer {token}
```

**Expected Response (200 OK)**: List of packed orders ready to ship

---

### Confirm Shipment
```
PATCH /dispatch/{orderId}/confirm-shipment
Headers: Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "trackingNumber": "TRACK123456789",
  "shippingMethod": "Express"
}
```

**Expected Response (200 OK):**
```json
{
  "orderId": "order123",
  "trackingNumber": "TRACK123456789",
  "status": "shipped"
}
```

---

### Mark as Delivered
```
PATCH /dispatch/{orderId}/mark-delivered
Headers: Authorization: Bearer {token}
```

**Expected Response (200 OK):**
```json
{
  "orderId": "order123",
  "status": "delivered",
  "deliveredAt": "2026-04-04T15:30:00Z"
}
```

---

## 👥 7. User Management

### Get All Users
```
GET /users
Headers: Authorization: Bearer {token}
```

**Expected Response (200 OK)**: List of all users

---

### Create New User
```
POST /users
Headers: Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "SecurePass@123",
  "role": "Picker",
  "department": "Warehouse"
}
```

**Expected Response (201 Created)**: New user object

---

### Update User
```
PATCH /users/{userId}
Headers: Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "role": "Packer",
  "isActive": true
}
```

**Expected Response (200 OK)**: Updated user object

---

### Delete User
```
DELETE /users/{userId}
Headers: Authorization: Bearer {token}
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "User deleted"
}
```

---

## 📈 8. Dashboard & Analytics

### Get Critical Items
```
GET /audit/critical-items
Headers: Authorization: Bearer {token}
```

**Expected Response (200 OK):**
```json
{
  "summary": {
    "totalItems": 150,
    "totalLowStock": 12,
    "totalExpired": 3,
    "totalExpiring": 8
  },
  "lowStockItems": [...],
  "expiredItems": [...],
  "expiringItems": [...]
}
```

---

## 🧪 Testing Checklist

### Core Functionality
- ✅ Health Check
- ✅ User Registration
- ✅ User Login
- ✅ Get User Profile
- ✅ Create Order
- ✅ Get All Orders
- ✅ Update Receiving Status
- ✅ Accept Receiving
- ✅ Mark Items as Picked
- ✅ Confirm Packed Items
- ✅ Confirm Shipment
- ✅ Get Critical Items

### Error Scenarios
- ❌ Invalid Credentials
- ❌ Expired Token
- ❌ Insufficient Permissions
- ❌ Invalid Order ID
- ❌ Duplicate SKU
- ❌ Missing Required Fields

---

## 🔧 Testing Tools

### Recommended Tools:
1. **Postman** - Full-featured REST client
2. **Insomnia** - Developer-friendly API client
3. **VS Code REST Client** - VSCode extension for testing
4. **cURL** - Command-line testing
5. **Thunder Client** - VSCode extension alternative

### Postman Collection
Ask your backend team for the Postman collection file to import all endpoints at once.

---

## 📝 Test Results Template

```
[ ] Health Check - PASS/FAIL
[ ] Auth/Register - PASS/FAIL
[ ] Auth/Login - PASS/FAIL
[ ] Orders/GetAll - PASS/FAIL
[ ] Orders/Create - PASS/FAIL
[ ] Inventory/GetAll - PASS/FAIL
[ ] Receiving/GetAll - PASS/FAIL
[ ] Picking/GetList - PASS/FAIL
[ ] Packing/GetList - PASS/FAIL
[ ] Dispatch/GetList - PASS/FAIL
[ ] Users/GetAll - PASS/FAIL
[ ] Audit/CriticalItems - PASS/FAIL

Overall Status: ________
Issues Found: ________
```

---

## 🚨 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| 401 Unauthorized | Token is invalid/expired - login again |
| 403 Forbidden | User doesn't have permission for this role |
| 404 Not Found | Resource ID doesn't exist |
| 500 Server Error | Backend error - check server logs |
| CORS Error | Backend cors not configured properly |
| Network Timeout | Backend server is slow/offline |

---

**Status**: ✅ All API Endpoints Documented  
**Ready for**: QA Testing, Integration Testing, User Acceptance Testing
