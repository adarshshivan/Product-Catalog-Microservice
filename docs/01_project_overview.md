# Project Overview

The **Product Catalog Microservice** is a fully serverless, cloud-native application designed to demonstrate end-to-end product management using a modern frontend and an AWS-powered microservice backend. The system delivers full CRUD functionality, secure image uploads using pre-signed URLs, real-time updates, and a seamless UI for managing product data.

The project follows a dual-mode execution model:

1. **AWS Mode** (Active Backend)

When the AWS backend is available, the application connects to a serverless microservice built using:

- AWS Lambda
- API Gateway
- DynamoDB
- Amazon S3

In this mode, users can create, list, update, and delete products, including uploading product images securely via pre-signed S3 URLs.

2. **Demo Mode** (No AWS Resources)

To optimize cloud costs and preserve long-term portfolio accessibility, all AWS resources were intentionally deleted after deployment.


When the backend is unavailable, the application automatically switches to Demo Mode and loads:

- Local sample data from demo-data.json
- Disabled CRUD buttons
- A visible “Demo Mode Active” banner
- A fully functional UI without backend dependency

This intelligent fallback mechanism ensures the project remains live, interactive, and error-free when deployed on Vercel.

---

## Key Capabilities

- Fully serverless microservice architecture
- CRUD operations for product catalog
- Image upload using secure S3 pre-signed URLs
- Responsive UI built with HTML, CSS, and Vanilla JS
- Deployed on Vercel with zero build step
- Automatic detection of backend availability
- Seamless Demo Mode fallback
- Cost-optimized architecture with no ongoing AWS charges

---

## Core Components

**Frontend (Vercel)**

- HTML + CSS for layout
- Vanilla JavaScript for interaction
- Dynamic rendering of product cards
- Modal-based product creation
- Toast notifications
- Fallback logic for Demo Mode

**Backend (AWS – deleted but code preserved)**

- Lambda microservice for all business logic
- API Gateway REST API
- DynamoDB table for product storage
- S3 bucket for product images
- IAM-secured roles and permissions

Backend source code is preserved inside the repository for clarity and future redeployment.

---

## Why This Project Matters

This project demonstrates practical cloud engineering skills including:

- REST API design
- Serverless architecture
- Static frontend deployment
- Pre-signed URL file handling
- Infrastructure cleanup and cost optimization
- Fault-tolerant UI/UX with offline fallback

It’s a complete end-to-end real-world microservice with production-level implementation.

---