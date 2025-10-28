import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Unified API for products, reviews, orders, and discounts
    Args: event with httpMethod, queryStringParameters (?action=products/reviews/orders/check-discount/create-order), body
    Returns: HTTP response with requested data
    '''
    method: str = event.get('httpMethod', 'GET')
    params = event.get('queryStringParameters') or {}
    action = params.get('action', 'products')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    
    try:
        if action == 'products' and method == 'GET':
            limit = params.get('limit', '100')
            
            query = f"SELECT id, name, category, condition, price, description, image_url, stock, created_at FROM products ORDER BY created_at DESC LIMIT {limit}"
            cur.execute(query)
            
            rows = cur.fetchall()
            products = []
            for row in rows:
                products.append({
                    'id': row[0],
                    'name': row[1],
                    'category': row[2],
                    'condition': row[3],
                    'price': float(row[4]),
                    'description': row[5],
                    'image_url': row[6],
                    'stock': row[7],
                    'created_at': row[8].isoformat() if row[8] else None
                })
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(products),
                'isBase64Encoded': False
            }
        
        elif action == 'reviews' and method == 'GET':
            cur.execute("SELECT id, customer_name, rating, comment, source, created_at FROM reviews ORDER BY created_at DESC")
            
            rows = cur.fetchall()
            reviews = []
            for row in rows:
                reviews.append({
                    'id': row[0],
                    'customer_name': row[1],
                    'rating': row[2],
                    'comment': row[3],
                    'source': row[4],
                    'created_at': row[5].isoformat() if row[5] else None
                })
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(reviews),
                'isBase64Encoded': False
            }
        
        elif action == 'check-discount' and method == 'GET':
            phone = params.get('phone', '')
            
            if not phone:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Phone number required'}),
                    'isBase64Encoded': False
                }
            
            cur.execute(f"SELECT discount_tier, total_orders FROM customers WHERE phone = '{phone}'")
            row = cur.fetchone()
            
            if row:
                discount_tier = row[0]
                total_orders = row[1]
            else:
                discount_tier = 0
                total_orders = 0
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'discount_tier': discount_tier, 'total_orders': total_orders}),
                'isBase64Encoded': False
            }
        
        elif action == 'create-order' and method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            phone = body_data.get('phone', '')
            items = body_data.get('items', [])
            discount_percent = body_data.get('discount_percent', 0)
            
            if not phone or not items:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Phone and items required'}),
                    'isBase64Encoded': False
                }
            
            total_amount = sum(item['price'] * item['quantity'] for item in items)
            total_amount_with_discount = total_amount * (1 - discount_percent / 100)
            
            cur.execute(
                f"INSERT INTO orders (customer_name, customer_phone, total_amount, discount_percent, status) VALUES ('Клиент', '{phone}', {total_amount_with_discount}, {discount_percent}, 'pending') RETURNING id"
            )
            order_id = cur.fetchone()[0]
            
            for item in items:
                cur.execute(
                    f"INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ({order_id}, {item['product_id']}, {item['quantity']}, {item['price']})"
                )
            
            cur.execute(f"SELECT id, total_orders FROM customers WHERE phone = '{phone}'")
            customer_row = cur.fetchone()
            
            if customer_row:
                customer_id = customer_row[0]
                new_total_orders = customer_row[1] + 1
                new_discount_tier = min(new_total_orders // 2, 3)
                cur.execute(
                    f"UPDATE customers SET total_orders = {new_total_orders}, discount_tier = {new_discount_tier} WHERE id = {customer_id}"
                )
            else:
                cur.execute(
                    f"INSERT INTO customers (phone, name, total_orders, discount_tier) VALUES ('{phone}', 'Клиент', 1, 0)"
                )
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'order_id': order_id, 'message': 'Order created'}),
                'isBase64Encoded': False
            }
        
        elif action == 'orders' and method == 'GET':
            phone = params.get('phone', '')
            
            if not phone:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Phone number required'}),
                    'isBase64Encoded': False
                }
            
            cur.execute(
                f"SELECT id, customer_name, customer_phone, customer_email, total_amount, discount_percent, status, is_preorder, created_at FROM orders WHERE customer_phone = '{phone}' ORDER BY created_at DESC"
            )
            
            rows = cur.fetchall()
            orders = []
            for row in rows:
                orders.append({
                    'id': row[0],
                    'customer_name': row[1],
                    'customer_phone': row[2],
                    'customer_email': row[3],
                    'total_amount': float(row[4]),
                    'discount_percent': row[5],
                    'status': row[6],
                    'is_preorder': row[7],
                    'created_at': row[8].isoformat() if row[8] else None
                })
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(orders),
                'isBase64Encoded': False
            }
        
        else:
            return {
                'statusCode': 404,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Not found'}),
                'isBase64Encoded': False
            }
    
    finally:
        cur.close()
        conn.close()
