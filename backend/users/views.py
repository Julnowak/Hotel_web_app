import datetime

from django.contrib.auth import login, logout
from rest_framework import status, permissions
from rest_framework.authentication import SessionAuthentication
from rest_framework.decorators import api_view
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.views import APIView

from users.serializers import UserSerializer, UserRegisterSerializer, UserLoginSerializer, RoomSerializer, \
    HotelSerializer, FloorSerializer, ReservationSerializer
from .models import AppUser, Room, Hotel, Floor, Reservation, Payment, Review
from .vaildations import validate_email, validate_password, custom_validation


class UserRegister(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        validated_data = custom_validation(request.data)
        serializer = UserRegisterSerializer(data=validated_data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.create(validated_data)
            user.user_type = validated_data['user_type']
            user.save()
            if user:
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(status.HTTP_400_BAD_REQUEST)


class UserLogin(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (SessionAuthentication,)

    def post(self, request):
        data = request.data
        print(data)
        assert validate_email(data)
        assert validate_password(data)
        serializer = UserLoginSerializer(data=data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.check_user(data)
            login(request, user)

            user_data = {
                'id': user.user_id,
                'username': user.username,
                'email': user.email,
                'user_type': user.user_type,
            }

            return Response(user_data, status=status.HTTP_200_OK)


class UserLogout(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def post(self, request):
        logout(request)

        return Response(status=status.HTTP_200_OK)


class UserView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    def get(self, request):
        serializer = UserSerializer(request.user)
        all_res = Reservation.objects.filter(user=request.user)
        num = all_res.count()

        # Pobranie wszystkich rezerwacji dla podanego użytkownika
        reservations = Reservation.objects.filter(user=request.user)
        reviews = Review.objects.filter(user=request.user)
        # Obliczanie liczby dni dla każdej rezerwacji i sumowanie
        total_days = sum((reservation.check_out - reservation.check_in).days for reservation in reservations)
        if reviews.count() != 0:
            mean_rating = sum(review.rating for review in reviews)/ reviews.count()
        else:
            mean_rating = 0
        return Response({'user': serializer.data, "reservations_number": num, "total_days": total_days,
                         "mean_rating": mean_rating}, status=status.HTTP_200_OK)

    def post(self, request):
        print("ffffffffwfw")
        serializer = UserSerializer(request.user)
        return Response({'user': serializer.data}, status=status.HTTP_200_OK)

    def put(self, request):
        user = request.user
        user.email = request.data.get("email")
        user.name = request.data.get("name")
        user.username = request.data.get("username")
        user.telephone = request.data.get("phone")
        user.address = request.data.get("address")
        user.surname = request.data.get("surname")
        user.save()
        serializer = UserSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request):
        user = request.user
        user.delete()
        return Response({'message': 'User deleted successfully'}, status=status.HTTP_204_NO_CONTENT)


class UploadAvatarView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):
        user = request.user
        profile_picture = request.FILES.get('profile_picture')  # Use 'avatar' as the field name for the image
        if profile_picture:
            user.profile_picture = profile_picture  # Assuming 'avatar' is a field on your User model
            user.save()
            serializer = UserSerializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({'error': 'No avatar image provided'}, status=status.HTTP_400_BAD_REQUEST)


class RoomApi(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def post(self, request):
        data = request.data
        hotel_id = int(data['hotel_id'])
        room_type = data['type']
        floor_id = int(data.get('floor_id', 1))
        check_in_date = datetime.datetime.strptime(data['check_in'], "%Y-%m-%d").date()
        check_out_date = datetime.datetime.strptime(data['check_out'], "%Y-%m-%d").date()

        # Fetch all rooms based on criteria
        rooms = Room.objects.filter(
            hotel__hotel_id=hotel_id,
            floor__floor_id=floor_id
        )

        # Prepare a list to store room data with availability status
        room_data = []

        for room in rooms:
            # Check if room has any conflicting reservations
            has_conflict = Reservation.objects.filter(
                room=room,
                check_in__lt=check_out_date,
                check_out__gt=check_in_date
            ).exists()

            # Set availability status based on conflicts
            room_status = "Available" if not has_conflict else "Unavailable"

            # Append room data with the status to room_data
            room_data.append({
                "room_id": room.room_id,
                "room_number": room.room_number,
                "room_type": room_type,
                "status": room_status
            })

        # Return the room data with availability status
        return Response(room_data, status=status.HTTP_200_OK)

    def put(self, request):
        data = request.data
        print(data)
        r = Room.objects.filter(type=data['type'], hotel__hotel_id=int(data['hotel_id']), floor__floor_number=data['floor_number'])
        print(r)
        serializer = RoomSerializer(r, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def get(self, request):
        print("fafwaa")
        print(request.data)
        r = Room.objects.all()
        print(r)
        serializer = RoomSerializer(r)
        return Response(serializer.data, status=status.HTTP_200_OK)


class NewReservationApi(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    def get(self, request, pk):
        r = Room.objects.get(room_id=pk)
        check_in = datetime.datetime.strptime(request.GET.get('checkIn'), '%Y-%m-%d').date()
        check_out = datetime.datetime.strptime(request.GET.get('checkOut'), '%Y-%m-%d').date()
        return Response({"price": r.price, "check_out": check_out, "check_in":check_in,
                         "user": request.user.username, "user_name": request.user.name,
                         "surname": request.user.surname,
                         "room_floor": r.floor.floor_number,
                         "room_type": r.type, "people_number": 1}, status=status.HTTP_200_OK)

    def post(self, request, pk):
        r = Room.objects.get(room_id=pk)
        print(request.data)
        check_in = datetime.datetime.strptime(request.data.get('checkIn'), '%Y-%m-%d').date()
        check_out = datetime.datetime.strptime(request.data.get('checkOut'), '%Y-%m-%d').date()
        people_number = request.data.get('peopleNumber')

        new_res = Reservation.objects.create(price=r.price, check_out=check_out, check_in=check_in,
                                             user=request.user, room=r, room_floor=r.floor, people_number=people_number,
                                             )

        new_trans = Payment.objects.create(reservation=new_res)
        r.status = "Unavailable"
        r.save()
        serializer = ReservationSerializer(new_res)
        return Response(serializer.data, status=status.HTTP_200_OK)


class HotelApi(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def post(self, request):
        data = request.data
        r = Room.objects.all()
        serializer = RoomSerializer(r, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def get(self, request):
        h = Hotel.objects.all()
        print(h)
        serializer = HotelSerializer(h, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class OneHotelApi(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    # def post(self, request):
    #     data = request.data
    #     r = Room.objects.all()
    #     serializer = RoomSerializer(r, many=True)
    #     return Response(serializer.data, status=status.HTTP_200_OK)

    def get(self, request, hotel_id):
        h = Hotel.objects.get(hotel_id=hotel_id)
        print(h)
        serializer = HotelSerializer(h)
        return Response(serializer.data, status=status.HTTP_200_OK)


class FloorApi(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def post(self, request):
        data = request.data
        r = Room.objects.all()
        serializer = RoomSerializer(r, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def get(self, request, hotel_id):
        f = Floor.objects.filter(hotel__hotel_id=hotel_id)
        serializer = FloorSerializer(f, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ReservationsAPI(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    def get(self, request):
        reservations = Reservation.objects.filter(user=request.user)
        serializer = ReservationSerializer(reservations, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)