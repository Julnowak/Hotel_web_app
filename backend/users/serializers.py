from django.core.exceptions import ValidationError
from rest_framework import serializers

# from django.contrib.auth.models import User
from django.contrib.auth import authenticate, get_user_model

from users.models import Hotel, Reservation, Room, Floor, Review

UserModel = get_user_model()


class UserRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = '__all__'

    def create(self, validated_data):
        user_obj = UserModel.objects.create_user(email=validated_data['email'],
                                                 password=validated_data['password'],
                                                 username=validated_data['username'])
        user_obj.username = validated_data['username']
        user_obj.save()
        return user_obj


class UserLoginSerializer(serializers.Serializer):

    email = serializers.EmailField()
    password = serializers.CharField()

    def check_user(self, validated_data):
        user = authenticate(username=validated_data['email'], password=validated_data['password'])
        if not user:
            raise ValidationError('User not found.')
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = '__all__'


class RoomSerializer(serializers.ModelSerializer):
    hotel = serializers.CharField(source='hotel.__str__', read_only=True)  # Ensure this points to the hotel field
    floor = serializers.IntegerField(source='floor.floor_number', read_only=True)  # Ensure this points to the hotel field

    class Meta:
        model = Room
        fields = [field.name for field in Room._meta.fields]


class HotelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hotel
        fields = '__all__'


class ReservationSerializer(serializers.ModelSerializer):
    hotel = serializers.CharField(source='room.hotel.__str__', read_only=True)  # Pobiera nazwę hotelu
    room_type = serializers.CharField(source='room.type', read_only=True)  # Pobiera typ pokoju
    room_number = serializers.CharField(source='room.room_number', read_only=True)  # Pobiera typ pokoju
    guest = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = Reservation
        fields = [
            'reservation_id',
            'price',
            'email',
            'deposit',
            'status',
            'check_in',
            'check_out',
            'is_paid',
            'people_number',
            'optional_guest_data',
            'hotel',  # Dodane pole dla hotelu
            'room_type',  # Dodane pole dla typu pokoju
            'room_id',
            'room_number',
            'creation_date',
            'paid_amount',
            'guest'
        ]


class ReviewSerializer(serializers.ModelSerializer):
    hotel = serializers.CharField(source='room.hotel.__str__', read_only=True)  # Pobiera nazwę hotelu
    room_type = serializers.CharField(source='room.type', read_only=True)  # Pobiera typ pokoju
    user = UserSerializer()

    class Meta:
        model = Review
        fields = [
            'review_id', 'rating', 'description', 'room', 'user', 'hotel', 'room_type', 'created_at'
        ]


class FloorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Floor
        fields = '__all__'