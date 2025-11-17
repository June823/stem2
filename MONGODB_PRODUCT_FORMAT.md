# MongoDB Product Upload Format

## Collection Name
`products` (Mongoose will pluralize "Product" model)

## Required Fields
- `productName` (String) - Required
- `category` (String) - Required (must match one of the category values below)
- `price` (Number) - Required
- `productImage` (Array of Strings) - Required, at least one image path

## Optional Fields
- `description` (String) - Optional

## Auto-Generated Fields
- `_id` - MongoDB ObjectId (auto-generated)
- `createdAt` - Timestamp (auto-generated)
- `updatedAt` - Timestamp (auto-generated)

---

## Valid Category Values

You can use any of these category values (case-sensitive):

1. `"baskets"`
2. `"handbags"`
3. `"hats"`
4. `"mats"`
5. `"sandals"`

---

## Image Path Format

**IMPORTANT:** Product images should use local backend uploads:

- **Local Backend Uploads** (recommended): `/uploads/products/{category}/{filename}.jpeg`
  - Example: `/uploads/products/baskets/basket1.jpeg`
  - This will be served at: `http://localhost:8080/uploads/products/baskets/basket1.jpeg`

The images should already exist in the `backend/uploads/products/{category}/` folder.

---

## MongoDB Insert Format

### Single Product Example

```json
{
  "productName": "Traditional Basket 1",
  "category": "baskets",
  "price": 2500,
  "productImage": [
    "/uploads/products/baskets/basket1.jpeg"
  ],
  "description": "Beautiful handwoven traditional basket, perfect for storage and decoration."
}
```

### Multiple Products Example (Array)

```json
[
  {
    "productName": "Designer Handbag 1",
    "category": "handbags",
    "price": 4500,
    "productImage": [
      "/uploads/products/handbags/handbg1.jpeg"
    ],
    "description": "Elegant designer handbag with modern styling."
  },
  {
    "productName": "Stylish Hat 1",
    "category": "hats",
    "price": 1800,
    "productImage": [
      "/uploads/products/hats/hat1.jpeg"
    ],
    "description": "Classic hat design perfect for sunny days."
  },
  {
    "productName": "Traditional Mat 1",
    "category": "mats",
    "price": 1500,
    "productImage": [
      "/uploads/products/mats/mat1.jpeg"
    ],
    "description": "Handwoven traditional mat, perfect for home decoration."
  }
]
```

---

## MongoDB Shell Commands

### Insert Single Product

```javascript
db.products.insertOne({
  productName: "Comfortable Sandals 1",
  category: "sandals",
  price: 2200,
  productImage: [
    "/uploads/products/sandals/sandals1.jpeg"
  ],
  description: "Comfortable leather sandals perfect for everyday wear."
})
```

### Insert Multiple Products

```javascript
db.products.insertMany([
  {
    productName: "Traditional Basket 1",
    category: "baskets",
    price: 2500,
    productImage: [
      "/uploads/products/baskets/basket1.jpeg"
    ],
    description: "Beautiful handwoven traditional basket, perfect for storage and decoration."
  },
  {
    productName: "Designer Handbag 1",
    category: "handbags",
    price: 4500,
    productImage: [
      "/uploads/products/handbags/handbg1.jpeg"
    ],
    description: "Elegant designer handbag with modern styling."
  },
  {
    productName: "Stylish Hat 1",
    category: "hats",
    price: 1800,
    productImage: [
      "/uploads/products/hats/hat1.jpeg"
    ],
    description: "Classic hat design perfect for sunny days."
  }
])
```

---

## Complete Product List

See `PRODUCTS_DATA.json` file for the complete list of all products with their images from the uploads folder.

The file contains:
- **8 Baskets** (basket1.jpeg - basket8.jpeg)
- **10 Handbags** (handbg1.jpeg, hdbg2-7.jpeg, bgpack1.jpeg, bg10.jpeg, bag11.jpeg)
- **6 Hats** (hat1.jpeg - hat6.jpeg)
- **5 Mats** (mat1.jpeg - mat5.jpeg)
- **4 Sandals** (sandals1.jpeg - sandals4.jpeg)

**Total: 33 Products**

---

## Important Notes

1. **Price**: Should be a number (not a string). Prices are in the base currency.

2. **Category**: Must exactly match one of the valid category values (case-sensitive).

3. **Images**: 
   - Use paths relative to the backend root: `/uploads/products/{category}/{filename}`
   - The images must already exist in the `backend/uploads/products/{category}/` folder
   - The backend serves these at `http://localhost:8080/uploads/products/{category}/{filename}`

4. **Description**: Optional but recommended for better product presentation.

5. **Timestamps**: `createdAt` and `updatedAt` are automatically added by MongoDB/Mongoose, so don't include them in your insert.

---

## Quick Reference

**Minimum Required Product:**
```json
{
  "productName": "Product Name",
  "category": "baskets",
  "price": 1000,
  "productImage": ["/uploads/products/baskets/image.jpeg"]
}
```

**Complete Product:**
```json
{
  "productName": "Product Name",
  "category": "baskets",
  "price": 1000,
  "productImage": [
    "/uploads/products/baskets/image1.jpeg",
    "/uploads/products/baskets/image2.jpeg"
  ],
  "description": "Product description here"
}
```

---

## Uploading via Admin Panel

You can also upload products through the admin panel:
1. Log in as admin
2. Navigate to `/admin-panel/all-products`
3. Click "Upload Product"
4. Fill in the form and upload images (images will be saved to `backend/uploads/products/{category}/`)
