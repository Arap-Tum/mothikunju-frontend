# API Endpoint Test Report
**Date**: April 4, 2026  
**System**: Muthokinju Warehouse Management System - Frontend  
**Backend URL**: https://muthokinju-warehouse-management-system.onrender.com/api

---

## API Endpoints Summary

### Authentication Endpoints (`/auth`)

| Endpoint | Method | Auth | Status | Notes |
|----------|--------|------|--------|-------|
| `/auth/health` | GET | No | 🔄 Pending | Health check endpoint |
| `/auth/register` | POST | No | 🔄 Pending | Register new user |
| `/auth/login` | POST | No | 🔄 Pending | User authentication |
| `/auth/profile` | GET | Yes | 🔄 Pending | Get current user profile |
| `/auth/logout` | POST | Yes | 🔄 Pending | User logout |

---

### Order Endpoints (`/orders`)

| Endpoint | Method | Auth | Status | Notes |
|----------|--------|------|--------|-------|
| `/orders` | GET | Yes | 🔄 Pending | Get all orders |
| `/orders` | POST | Yes | 🔄 Pending | Create new order |
| `/orders/{id}` | GET | Yes | 🔄 Pending | Get order by ID |
| `/orders/{id}` | PATCH | Yes | 🔄 Pending | Update order |
| `/orders/{id}` | DELETE | Yes | 🔄 Pending | Cancel order |
| `/orders/my-orders` | GET | Yes | 🔄 Pending | Get user's orders |

---

### Inventory Endpoints (`/inventory`)

| Endpoint | Method | Auth | Status | Notes |
|----------|--------|------|--------|-------|
| `/inventory` | GET | Yes | 🔄 Pending | Get all inventory items |
| `/inventory` | POST | Yes | 🔄 Pending | Create inventory item |
| `/inventory/{sku}` | GET | Yes | 🔄 Pending | Get item by SKU |
| `/inventory/{sku}` | PATCH | Yes | 🔄 Pending | Update inventory item |
| `/inventory/{sku}` | DELETE | Yes | 🔄 Pending | Delete inventory item |

---

### Receiving Endpoints (`/receiving`)

| Endpoint | Method | Auth | Status | Notes |
|----------|--------|------|--------|-------|
| `/receiving` | GET | Yes | 🔄 Pending | Get all receiving documents |
| `/receiving` | POST | Yes | 🔄 Pending | Create receiving document |
| `/receiving/{id}` | GET | Yes | 🔄 Pending | Get receiving by ID |
| `/receiving/{id}/update-quantities` | PATCH | Yes | 🔄 Pending | Update received quantities |
| `/receiving/{id}/inspect` | PATCH | Yes | 🔄 Pending | Inspect goods |
| `/receiving/{id}/accept` | PATCH | Yes | 🔄 Pending | Accept receiving |
| `/receiving/{id}/reject` | PATCH | Yes | 🔄 Pending | Reject receiving |

---

### Picking Endpoints (`/picking`)

| Endpoint | Method | Auth | Status | Notes |
|----------|--------|------|--------|-------|
| `/picking` | GET | Yes | 🔄 Pending | Get pending picks |
| `/picking/{id}/assign` | PATCH | Yes | 🔄 Pending | Assign to picker |
| `/picking/{id}/mark-picked` | PATCH | Yes | 🔄 Pending | Mark items as picked |

---

### Packing Endpoints (`/packing`)

| Endpoint | Method | Auth | Status | Notes |
|----------|--------|------|--------|-------|
| `/packing` | GET | Yes | 🔄 Pending | Get items ready for packing |
| `/packing/{id}/confirm` | PATCH | Yes | 🔄 Pending | Confirm packed items |

---

### Dispatch Endpoints (`/dispatch`)

| Endpoint | Method | Auth | Status | Notes |
|----------|--------|------|--------|-------|
| `/dispatch` | GET | Yes | 🔄 Pending | Get ready for dispatch |
| `/dispatch/{id}/confirm-shipment` | PATCH | Yes | 🔄 Pending | Confirm shipment |
| `/dispatch/{id}/mark-delivered` | PATCH | Yes | 🔄 Pending | Mark as delivered |

---

### Users Endpoints (`/users`)

| Endpoint | Method | Auth | Status | Notes |
|----------|--------|------|--------|-------|
| `/users` | GET | Yes | 🔄 Pending | Get all users |
| `/users` | POST | Yes | 🔄 Pending | Create new user |
| `/users/{id}` | GET | Yes | 🔄 Pending | Get user by ID |
| `/users/{id}` | PATCH | Yes | 🔄 Pending | Update user |
| `/users/{id}` | DELETE | Yes | 🔄 Pending | Delete user |

---

### Audit Endpoints (`/audit`)

| Endpoint | Method | Auth | Status | Notes |
|----------|--------|------|--------|-------|
| `/audit/critical-items` | GET | Yes | 🔄 Pending | Get critical inventory items |

---

## Testing Instructions

### Manual Testing Steps:

1. **Register a new user**
   ```
   POST /auth/register
   Body: {
     "name": "Test User",
     "email": "test@example.com",
     "password": "Test@1234",
     "role": "Sales Staff",
     "department": "Warehouse"
   }
   ```

2. **Login to get token**
   ```
   POST /auth/login
   Body: {
     "email": "test@example.com",
     "password": "Test@1234"
   }
   ```
   **Response**: Returns JWT token in response

3. **Use token for authenticated requests**
   - Add header: `Authorization: Bearer <token>`
   - Use token for all subsequent requests

4. **Test endpoints**
   - Use Postman, Insomnia, or `curl` to test each endpoint
   - Include auth token in Authorization header

---

## API Client Configuration

**Base URL**: https://muthokinju-warehouse-management-system.onrender.com/api
**Token Storage**: localStorage as `token`
**Token Format**: `Bearer <token>`
**Content-Type**: `application/json`

---

## Error Handling

- **401 Unauthorized**: Token is invalid or expired - redirect to login
- **403 Forbidden**: User doesn't have permission for this action
- **404 Not Found**: Resource doesn't exist
- **500 Server Error**: Backend server error
- **503 Service Unavailable**: Backend is offline

---

## Test Status Legend

- 🟢 ✅ PASS - Endpoint working correctly
- 🔴 ❌ FAIL - Endpoint not working
- 🟡 🔄 PENDING - Not yet tested
- ⚠️  WARN - Endpoint working but with warnings

---

## Environment Variables

```env
VITE_API_BASE_URL=https://muthokinju-warehouse-management-system.onrender.com/api
```

This is configured in the `.env` file or hardcoded in `src/lib/api.ts`.

---

**Last Updated**: April 4, 2026
**Tested By**: Automated API Test Suite
