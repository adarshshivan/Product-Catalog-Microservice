# Possible Approaches

There are multiple ways to build a product catalog system. Below are the most viable architectures.

## 1. Fully Serverless (Chosen Model)
- Lambda for compute
- API Gateway for routing
- DynamoDB for data storage
- S3 for object storage
- Zero server maintenance

**Pros:**
- Cost-efficient
- Scales automatically
- Ideal for simple CRUD apps

**Cons:**
- Cold starts may add slight latency

## 2. Containerized Architecture (ECS/EKS)

Pros:
- More control over runtime
- Suitable for complex workloads

**Cons:**
- More expensive
- Additional infra to manage

## 3. Monolithic EC2 Application
**Pros:**
- Traditional, straightforward setup

**Cons:**
- Requires patching, scaling, monitoring
- Not ideal for modern cloud projects

---

The serverless model delivers maximum efficiency with minimum cost, making it the optimal solution.

---