import json
import os
import boto3
import uuid
from datetime import datetime
from boto3.dynamodb.conditions import Key

dynamodb = boto3.resource('dynamodb')
s3 = boto3.client('s3')

TABLE_NAME = os.environ.get('TABLE_NAME')
BUCKET_NAME = os.environ.get('BUCKET_NAME')
table = dynamodb.Table(TABLE_NAME)

# -------------------------------------------------------
# GLOBAL CORS HEADERS (APPLIED TO EVERY RESPONSE)
# -------------------------------------------------------
CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "*"
}

def response(status_code, body):
    return {
        "statusCode": status_code,
        "headers": CORS_HEADERS,
        "body": json.dumps(body, default=str)
    }

# -------------------------------------------------------
# MAIN LAMBDA HANDLER
# -------------------------------------------------------
def lambda_handler(event, context):
    http_method = event.get('httpMethod', '')
    path = event.get('path', '')

    # Immediately allow OPTIONS preflight
    if http_method == "OPTIONS":
        return {
            "statusCode": 200,
            "headers": CORS_HEADERS,
            "body": json.dumps({"message": "CORS preflight OK"})
        }

    try:
        # CREATE PRODUCT
        if http_method == 'POST' and path.endswith('/products'):
            return create_product(event)

        # LIST PRODUCTS
        elif http_method == 'GET' and path.endswith('/products'):
            return list_products(event)

        # GENERATE PRE-SIGNED UPLOAD URL
        elif http_method == 'POST' and path.endswith('/upload-url'):
            return generate_upload_url(event)

        # GET PRODUCT DETAILS
        elif http_method == 'GET' and '/products/' in path:
            return get_product(event)

        # UPDATE PRODUCT
        elif http_method == 'PUT' and '/products/' in path:
            return update_product(event)

        # DELETE PRODUCT
        elif http_method == 'DELETE' and '/products/' in path:
            return delete_product(event)

        else:
            return response(404, {"message": "Route not found"})

    except Exception as e:
        print("Error:", str(e))
        return response(500, {"error": str(e)})



# -------------------------------------------------------
# ROUTE HANDLERS
# -------------------------------------------------------

def create_product(event):
    body = json.loads(event.get('body') or '{}')
    product_id = "prod-" + str(uuid.uuid4())[:8]
    now = datetime.utcnow().isoformat() + "Z"

    item = {
        "productId": product_id,
        "title": body.get("title"),
        "description": body.get("description"),
        "price": body.get("price"),
        "currency": body.get("currency", "INR"),
        "stock": body.get("stock", 0),
        "category": body.get("category"),
        "imageKey": None,
        "createdAt": now,
        "updatedAt": now
    }

    table.put_item(Item=item)
    return response(201, {"product": item})


def list_products(event):
    resp = table.scan()
    items = resp.get('Items', [])

    # Generate image URLs for list view also
    for item in items:
        if item.get("imageKey"):
            item["imageUrl"] = s3.generate_presigned_url(
                'get_object',
                Params={"Bucket": BUCKET_NAME, "Key": item["imageKey"]},
                ExpiresIn=3600
            )

    return response(200, {"products": items})


def get_product(event):
    product_id = event["pathParameters"]["productId"]
    resp = table.get_item(Key={"productId": product_id})
    item = resp.get("Item")

    if not item:
        return response(404, {"message": "Product not found"})

    if item.get("imageKey"):
        item["imageUrl"] = s3.generate_presigned_url(
            'get_object',
            Params={"Bucket": BUCKET_NAME, "Key": item["imageKey"]},
            ExpiresIn=3600
        )

    return response(200, {"product": item})


def update_product(event):
    product_id = event["pathParameters"]["productId"]
    body = json.loads(event.get("body") or "{}")

    update_expr = []
    expr_attr = {}

    allowed_fields = ["title", "description", "price", "currency", "stock", "category", "imageKey"]

    for field in allowed_fields:
        if field in body:
            update_expr.append(f"{field} = :{field}")
            expr_attr[f":{field}"] = body[field]

    if not update_expr:
        return response(400, {"message": "Nothing to update"})

    update_expr.append("updatedAt = :u")
    expr_attr[":u"] = datetime.utcnow().isoformat() + "Z"

    table.update_item(
        Key={"productId": product_id},
        UpdateExpression="SET " + ", ".join(update_expr),
        ExpressionAttributeValues=expr_attr
    )

    return response(200, {"message": "Product updated"})


def delete_product(event):
    product_id = event["pathParameters"]["productId"]

    # Delete image if exists
    resp = table.get_item(Key={"productId": product_id})
    item = resp.get("Item")

    if item and item.get("imageKey"):
        try:
            s3.delete_object(Bucket=BUCKET_NAME, Key=item["imageKey"])
        except Exception as e:
            print("Image delete error:", e)

    table.delete_item(Key={"productId": product_id})

    return response(200, {"message": "Product deleted"})


# -------------------------------------------------------
# PRE-SIGNED UPLOAD URL
# -------------------------------------------------------

def generate_upload_url(event):
    product_id = event["pathParameters"]["productId"]
    key = f"images/{product_id}-{uuid.uuid4().hex[:6]}.jpg"

    url = s3.generate_presigned_url(
        ClientMethod='put_object',
        Params={"Bucket": BUCKET_NAME, "Key": key, "ContentType": "image/jpeg"},
        ExpiresIn=300
    )

    return response(200, {
        "uploadUrl": url,
        "imageKey": key
    })
