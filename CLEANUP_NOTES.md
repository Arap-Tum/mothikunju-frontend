# Code Cleanup - Deprecated Files

## Files to Remove
The following files are deprecated and should be deleted as they have been replaced with new implementations:

### 1. **ReceiveStock.tsx** (DEPRECATED)
- **Location**: `src/pages/ReceiveStock.tsx`
- **Replacement**: Use `Receiving.tsx` instead
- **Reason**: Old implementation uses non-existent `stockApi`
- **Status**: ❌ REMOVE

### 2. **DispatchStock.tsx** (DEPRECATED)  
- **Location**: `src/pages/DispatchStock.tsx`
- **Replacement**: Use `Dispatch.tsx` instead
- **Reason**: Old implementation uses non-existent `stockApi`
- **Status**: ❌ REMOVE

### 3. **StockHistory.tsx** (DEPRECATED)
- **Location**: `src/pages/StockHistory.tsx`
- **Reason**: Old implementation using non-existent `stockApi`
- **Status**: ❌ REMOVE
- **Note**: Audit functionality now integrated in Dashboard and AuditService

### 4. **StockTransfer.tsx** (DEPRECATED)
- **Location**: `src/pages/StockTransfer.tsx`  
- **Reason**: Old implementation using non-existent `stockApi`
- **Status**: ❌ REMOVE
- **Note**: Stock transfer functionality can be handled through Inventory management

### 5. **Index.tsx** (PLACEHOLDER)
- **Location**: `src/pages/Index.tsx`
- **Reason**: Placeholder content, not used in routing
- **Status**: ❌ REMOVE

## Cleanup Summary

### ✅ Cleaned Imports
- Fixed duplicate imports in `CreateReceivingForm.tsx` (removed duplicate `ReceivingItem`)
- Fixed duplicate imports in `CreateOrderForm.tsx` (removed duplicate `OrderItem`)

### ✅ Updated Routes (App.tsx)
- Added new page imports: `Receiving`, `Dispatch`, `Orders`, `Picking`, `Packing`
- Removed old imports: `ReceiveStock`, `DispatchStock`, `StockHistory`, `StockTransfer`
- Updated routes to use new components

### ✅ New Routes Added
| Route | Component | Status |
|-------|-----------|--------|
| `/orders` | `Orders.tsx` | ✅ Added |
| `/picking` | `Picking.tsx` | ✅ Added |
| `/packing` | `Packing.tsx` | ✅ Added |
| `/receive` | `Receiving.tsx` | ✅ Updated |
| `/dispatch` | `Dispatch.tsx` | ✅ Updated |
| `/inventory` | `Inventory.tsx` | ✅ Kept |
| `/users` | `Users.tsx` | ✅ Kept |

## How to Complete Cleanup

Run these commands to delete deprecated files:
```bash
rm src/pages/ReceiveStock.tsx
rm src/pages/DispatchStock.tsx
rm src/pages/StockHistory.tsx
rm src/pages/StockTransfer.tsx
rm src/pages/Index.tsx
```

Or in PowerShell:
```powershell
Remove-Item src/pages/ReceiveStock.tsx
Remove-Item src/pages/DispatchStock.tsx
Remove-Item src/pages/StockHistory.tsx
Remove-Item src/pages/StockTransfer.tsx
Remove-Item src/pages/Index.tsx
```

## Current Page Structure (After Cleanup)

```
src/pages/
├── Dashboard.tsx          ✅ Main dashboard with role-specific views
├── Login.tsx              ✅ Authentication
├── Register.tsx           ✅ User registration
├── NotFound.tsx           ✅ 404 page
├── Inventory.tsx          ✅ Inventory management
├── Orders.tsx             ✅ Order management (NEW)
├── Picking.tsx            ✅ Picking workflow (NEW)
├── Packing.tsx            ✅ Packing workflow (NEW)
├── Receiving.tsx          ✅ Receiving workflow (NEW)
├── Dispatch.tsx           ✅ Dispatch/Shipment (NEW)
├── Users.tsx              ✅ User management
└── [DEPRECATED - TO DELETE]
    ├── ReceiveStock.tsx   ❌
    ├── DispatchStock.tsx  ❌
    ├── StockHistory.tsx   ❌
    ├── StockTransfer.tsx  ❌
    └── Index.tsx          ❌
```

## Status
- ✅ Code cleanup partially complete
- ⏳ Pending: Manual deletion of deprecated files
- ✅ All imports fixed
- ✅ All routes updated
- ✅ Development server ready
