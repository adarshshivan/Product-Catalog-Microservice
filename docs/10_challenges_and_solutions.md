# Challenges and Solutions

## 1. Maintaining Long-Term Demo Availability
**Challenge:** AWS resources incur ongoing cost.  
**Solution:** Implemented Demo Mode fallback + deleted backend resources.

## 2. Secure Image Uploads
**Challenge:** Avoid exposing S3 bucket.  
**Solution:** Used pre-signed URLs generated via Lambda.

## 3. CORS Issues
**Challenge:** API requests blocked in browser.  
**Solution:** Configured CORS headers in API Gateway.

## 4. Cold Start Latency
**Challenge:** Occasional delays in Lambda execution.  
**Solution:** Optimized code and minimized dependencies.

## 5. Dynamic UI Updates
**Challenge:** Rendering product list efficiently.  
**Solution:** Created modular JS components and DOM rendering functions.

These obstacles improved overall cloud design skills and architectural decision-making.
