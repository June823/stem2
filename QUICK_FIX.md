# Quick Fix Guide - Products Not Showing

## Immediate Steps to Debug

### 1. Check Backend Console Logs

When you navigate to baskets category, you should see in your backend console:
```
🔍 Searching for category: baskets
✅ Found 8 products with exact match for category: "baskets"
📦 Sample product: { ... }
```

If you see:
```
⚠️ No products found. Available categories in DB: [...]
```
This means the category name in MongoDB doesn't match.

### 2. Verify MongoDB Data Directly

Run this in MongoDB Compass or shell:

```javascript
// Check if baskets products exist
db.products.find({category: "baskets"}).count()

// See all baskets products
db.products.find({category: "baskets"}).pretty()

// Check what categories actually exist
db.products.distinct("category")
```

### 3. Check Browser Console

Open browser DevTools (F12) → Console tab:

- Navigate to baskets category
- Look for console logs:
  - `🔍 Fetching products for categories: ["baskets"]`
  - `📦 Filter response: {...}`
  - `✅ Products received: 8`

### 4. Test API Directly

In browser console, run:

```javascript
// Test category-product endpoint (for home page)
fetch('http://localhost:8080/api/category-product', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ category: 'baskets' })
})
.then(r => r.json())
.then(d => {
  console.log('Response:', d);
  console.log('Products found:', d.data?.length || 0);
});

// Test filter-product endpoint (for category page)
fetch('http://localhost:8080/api/filter-product', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ category: ['baskets'] })
})
.then(r => r.json())
.then(d => {
  console.log('Filter response:', d);
  console.log('Products found:', d.data?.length || 0);
});
```

### 5. Common Issues & Solutions

| Problem | Solution |
|---------|----------|
| Category is "Baskets" (capital B) | Update MongoDB: `db.products.updateMany({category: "Baskets"}, {$set: {category: "baskets"}})` |
| Category is "basket" (singular) | Update MongoDB: `db.products.updateMany({category: "basket"}, {$set: {category: "baskets"}})` |
| Image paths wrong | Should be `/uploads/products/baskets/basket1.jpeg` |
| Empty array returned | Check category spelling exactly matches "baskets" |
| Backend not running | Start backend server on port 8080 |

### 6. Quick MongoDB Fix Command

If your category is wrong, fix it:

```javascript
// Fix any case variations
db.products.updateMany(
  { category: { $regex: /^baskets?$/i } },
  { $set: { category: "baskets" } }
)

// Verify fix
db.products.find({category: "baskets"}).count()
```

### 7. Verify Environment Variable

Check if `REACT_APP_SERVER_DOMAIN` is set correctly in frontend `.env` file:
```
REACT_APP_SERVER_DOMAIN=http://localhost:8080/api
```

Or if using the common/index.js format, it should be:
```javascript
const backendDomin = "http://localhost:8080"
```

### 8. Restart Everything

1. Stop backend server (Ctrl+C)
2. Restart backend: `cd backend && npm start`
3. Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
4. Clear browser cache

## What to Check First

**Most Likely Issues:**
1. ✅ Category spelling in MongoDB doesn't match "baskets" exactly
2. ✅ Backend server not running or not connected to MongoDB
3. ✅ Environment variable `REACT_APP_SERVER_DOMAIN` not set correctly

**After checking these, look at:**
- Backend console logs (should show what categories exist)
- Browser console logs (should show API calls and responses)
- Network tab in DevTools (check if requests are successful)




