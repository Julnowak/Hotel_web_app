import datetime

from django.contrib.auth import login, logout
from rest_framework import status, permissions
from rest_framework.authentication import SessionAuthentication
from rest_framework.response import Response
from rest_framework.views import APIView

from users.serializers import UserSerializer, UserRegisterSerializer, UserLoginSerializer, RoomSerializer, \
    HotelSerializer, FloorSerializer, ReservationSerializer
from .models import AppUser, Room, Hotel, Floor, Reservation, Payment
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
        return Response({'user': serializer.data}, status=status.HTTP_200_OK)

    def post(self, request):
        print("ffffffffwfw")
        serializer = UserSerializer(request.user)
        return Response({'user': serializer.data}, status=status.HTTP_200_OK)

    def put(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'user': serializer.data}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        user = request.user
        user.delete()
        return Response({'message': 'User deleted successfully'}, status=status.HTTP_204_NO_CONTENT)


class RoomApi(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def post(self, request):
        data = request.data
        print(data)
        r = Room.objects.filter(type=data['type'], hotel__hotel_id=int(data['hotel_id']), floor__floor_id=1)
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