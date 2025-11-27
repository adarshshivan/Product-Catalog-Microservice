**Product Catalog Microservice – Serverless + Vercel Frontend**

A fully-functional, cloud-native **Product Catalog Microservice** built using an AWS serverless backend and a modern static frontend deployed on Vercel.
The system supports full CRUD operations, image uploads to S3 using pre-signed URLs, DynamoDB-based storage, and a clean UI for product management.

After deployment, all AWS resources were intentionally deleted to maintain zero cloud cost.

The frontend includes an intelligent **Dual-Mode** Engine:

**AWS Mode** (active only when backend exists)

**Demo Mode** (automatically activated when backend is absent)

- If AWS backend is unavailable → Demo Mode will activate

- If AWS backend is restored → Full CRUD mode is enabled automatically

---

Detailed documentation for every phase of this project is located inside the `/docs/` directory

---