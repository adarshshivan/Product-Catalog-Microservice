# Step-by-Step Tutorial

This guide explains the exact steps used to build the backend and frontend.

## 1. Create the DynamoDB Table
- Table name: product-catalog
- Partition key: productId (String)

## 2. Create the S3 Bucket
- Enable public access block (recommended)
- Create folders for image storage if needed

## 3. Create Lambda Functions
Functions:
- createProduct
- getProducts
- updateProduct
- deleteProduct
- generateUploadURL

Include business logic + DynamoDB operations.

## 4. Set Up API Gateway
- Create REST API
- Define routes:
  - POST /products
  - GET /products
  - PUT /products/{id}
  - DELETE /products/{id}
  - GET /upload-url
- Integrate each route with the correct Lambda

## 5. Configure IAM Roles
- Allow Lambda read/write to DynamoDB
- Allow S3 pre-signed URL generation

## 6. Deploy Frontend
- Upload static files to Vercel
- Update API endpoints inside config.js
- Push repo to GitHub → Deploy

## 7. Implement Demo Mode
- Detect API availability
- Load sample data from demo-data.json
- Disable CRUD buttons in Demo Mode
- Display banner indicating fallback mode

All steps are preserved so the backend can be redeployed at any time.

---
