import json
import boto3
from boto3.dynamodb.conditions import Key
import os

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(os.environ['TABLE_NAME'])

def lambda_handler(event, context):
    try:
        if event['path'] == '/resume':
            return handle_resume_request()
        elif event['path'] == '/visitors':
            return handle_visitor_request()
        return respond(404, {'message': 'Not found'})
    except Exception as e:
        return respond(500, {'error': str(e)})

def handle_resume_request():
    response = table.get_item(Key={'id': 'resume_data'})
    return respond(200, response.get('Item', {}))

def handle_visitor_request():
    response = table.update_item(
        Key={'id': 'visitor_count'},
        UpdateExpression='ADD #count :incr',
        ExpressionAttributeNames={'#count': 'count'},
        ExpressionAttributeValues={':incr': 1},
        ReturnValues='UPDATED_NEW'
    )
    return respond(200, {'count': response['Attributes']['count']})

def respond(status_code, body):
    return {
        'statusCode': status_code,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps(body)
    }