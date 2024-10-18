import datetime
import json
import time

from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.layers import get_channel_layer
from .models import Product, AppUser


class UsersConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print('connected')
        self.user_socket = "user_socket"

        # Join room group
        await self.channel_layer.group_add(self.user_socket, self.channel_name)

        print(get_channel_layer())
        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        print('disconnected')
        await self.channel_layer.group_discard(self.user_socket, self.channel_name)

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        print(text_data_json)
        productId = text_data_json['productId']
        userId = text_data_json['userId']

        likes = await self.set_like(productId, userId)

        await self.channel_layer.group_send(
            self.user_socket, {'type': 'users.message', "likes": likes}
        )

    # Receive message from room group
    async def users_message(self, event):
        print(event)
        likes = event["likes"]

        # Send message to WebSocket
        await self.send(text_data=json.dumps({"likes": likes}))

    # @sync_to_async
    # def set_like(self, productId, userId):
    #     if UserLike.objects.filter(user_id=int(userId), product_id=productId).exists():
    #         UserLike.objects.get(user_id=int(userId), product_id=productId).delete()
    #     else:
    #         UserLike.objects.create(user_id=int(userId), product_id=productId)
    #     p = Product.objects.get(id=productId)
    #     p.likes = UserLike.objects.filter(product_id=productId).count()
    #     p.save()
    #     return p


class ProductConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print('connected')
        self.product_socket = "product_socket"

        # Join room group
        await self.channel_layer.group_add(self.product_socket, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        print('disconnected')
        await self.channel_layer.group_discard(self.product_socket, self.channel_name)

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        print(text_data_json)
        productId = text_data_json['productId']
        call_type = text_data_json["call_type"]

        if call_type == "product_created":
            username = text_data_json['username']
            is_bought = text_data_json['is_bought']
            likes = text_data_json['likes']
            name = text_data_json['name']
            image = text_data_json['image']
            price = text_data_json['price']
            await self.create_product(productId=productId, name=name, price=price, image=image, is_bought=bool(is_bought), likes=likes, username=username)

        elif call_type == "product_edited":
            name = text_data_json['name']
            image = text_data_json['image']
            price = text_data_json['price']
            await self.edit_product(productId=productId, name=name, price=price, image=image)

        elif call_type == "product_deleted":
            print('sssss')
            username = text_data_json['username']
            await self.delete_product(productId=productId, username=username)

    @sync_to_async
    def create_product(self, productId, name, price, image, is_bought, likes, username):
        product = Product(id=productId, name=name, price=price,
                          image=image, is_bought=bool(is_bought),
                          likes=likes)
        product.save()

        print('created')

        return product

    @sync_to_async
    def edit_product(self, productId, name, price, image, description):
        print(f"dddddddddddd {productId}")
        product = Product.objects.get(productId)
        product.name = name
        product.price = price
        product.image = image
        product.description = description
        product.save()
        print('edited')

        return product

    @sync_to_async
    def delete_product(self, productId, username):
        product = Product.objects.get(id=productId)
        product.delete()
        print('deleted')
        return None

