import datetime

from django.contrib.auth import login, logout, authenticate
from rest_framework import status, permissions
from rest_framework.authentication import SessionAuthentication
from rest_framework.decorators import api_view
from rest_framework.pagination import PageNumberPagination
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from users.serializers import UserSerializer, UserRegisterSerializer, UserLoginSerializer, RoomSerializer, \
    HotelSerializer, FloorSerializer, ReservationSerializer, ReviewSerializer
from .models import AppUser, Room, Hotel, Floor, Reservation, Payment, Review
from .vaildations import validate_email, validate_password, custom_validation
from django.contrib.auth import login
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import permissions, status

from django.http import JsonResponse
from django.middleware.csrf import get_token


def csrf(request):
    return JsonResponse({'csrfToken': get_token(request)})


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

    def post(self, request):
        data = request.data
        assert validate_email(data)
        assert validate_password(data)
        serializer = UserLoginSerializer(data=data)
        if serializer.is_valid(raise_exception=True):
            user = authenticate(request, email=data['email'], password=data['password'])
            login(request, user)


            # Set CSRF token
            csrf_token = get_token(request)

            user_data = {
                'id': user.user_id,
                'username': user.username,
                'email': user.email,
                'user_type': user.user_type,
            }

            response = Response(user_data, status=status.HTTP_200_OK)
            response.set_cookie('csrftoken', csrf_token)  # Set the CSRF token cookie
            return response


class UserLogout(APIView):
    permission_classes = (permissions.IsAuthenticated,)  # Only authenticated users can log out
    authentication_classes = (SessionAuthentication,)  # Use session-based authentication

    def post(self, request):
        logout(request)  # This logs out the user (clears session)Clear the session cookie explicitly
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
                "status": room_status,
                "price": room.price,
            })

        # Return the room data with availability status
        return Response(room_data, status=status.HTTP_200_OK)

    def put(self, request):
        data = request.data
        hotel_id = int(data['hotel_id'])
        room_type = data['type']
        print(data)
        try:
            floor_num = int(data.get('floor_num'))
        except:
            floor_id = 1
        check_in_date = datetime.datetime.strptime(data['check_in'], "%Y-%m-%d").date()
        check_out_date = datetime.datetime.strptime(data['check_out'], "%Y-%m-%d").date()

        # Fetch all rooms based on criteria
        rooms = Room.objects.filter(
            hotel__hotel_id=hotel_id,
            floor__floor_number=floor_num
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
        # Pobierz wszystkie rezerwacje z powiązanymi pokojami i hotelami
        reservations = Reservation.objects.select_related('room__hotel').all().filter(user=request.user)

        # Serializacja danych
        serializer = ReservationSerializer(reservations, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class AvailableRoomsView(APIView):
    def get(self, request):
        available_rooms = Room.objects.filter(status="Available")
        serializer = RoomSerializer(available_rooms, many=True)
        return Response(serializer.data)


class ReservationDetailsAPI(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    # dla zmiany statusu zamówienia
    def post(self, request, reservation_id):
        operation_type = request.data["operation_type"]
        reservation = get_object_or_404(Reservation, reservation_id=int(reservation_id))
        if operation_type == "zapłata":
            reservation.status = "Opłacona"
        elif operation_type == "anulowanie":
            reservation.status = "Anulowana"
        reservation.save()
        serializer = ReservationSerializer(reservation)
        return Response(serializer.data)

    def get(self, request, reservation_id):
        reservation = get_object_or_404(Reservation, reservation_id=reservation_id)
        serializer = ReservationSerializer(reservation)
        return Response(serializer.data)

    def put(self, request, reservation_id):
        reservation = get_object_or_404(Reservation, reservation_id=reservation_id)
        serializer = ReservationSerializer(reservation, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, reservation_id):
        reservation = get_object_or_404(Reservation, reservation_id=reservation_id)
        reservation.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ReviewsApi(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    def post(self, request):
        data = request.data
        h = Hotel.objects.get(hotel_id=int(data.get("hotel")['hotel_id']))
        new_review = Review.objects.create(user=request.user, rating=data.get("rating"), description=data.get("description"),
                                           hotel=h)
        revs = Review.objects.filter(hotel=h)
        suma = [float(i[0]) for i in revs.values_list("rating")]
        if revs.count():
            h.rating = sum(suma)/revs.count()
        else:
            h.rating = 0
        h.save()

        res = Review.objects.filter(hotel__hotel_id=int(data.get("hotel")['hotel_id']))
        print(res)
        serializer = ReviewSerializer(res, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def get(self, request):
        res = Review.objects.filter(hotel__hotel_id=int(request.query_params.get('hotel_id')))
        serializer = ReviewSerializer(res, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UserReservationsPagination(PageNumberPagination):
    page_size = 5  # Liczba elementów na stronie
    page_size_query_param = 'per_page'


class UserReservationsView(APIView):
    def get(self, request):
        paginator = UserReservationsPagination()
        reservations = Reservation.objects.filter(user=request.user).select_related('room__hotel')
        paginated_reservations = paginator.paginate_queryset(reservations, request)
        serializer = ReservationSerializer(paginated_reservations, many=True)
        return paginator.get_paginated_response(serializer.data)


class RoomPricesView(APIView):
    def get(self, request):
        rooms = Room.objects.all()
        data = {
            room.room_id: {
                "room_number": room.room_number,
                "hotel_name": room.hotel.localization,
                "price": room.price,
            }
            for room in rooms
        }
        return Response(data)

    def put(self, request):
        for room_id, room_data in request.data.items():
            try:
                room = Room.objects.get(pk=room_id)
                room.price = room_data.get("price", room.price)
                room.save()
            except Room.DoesNotExist:
                return Response(
                    {"error": f"Room with ID {room_id} does not exist."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        return Response({"message": "Room prices updated successfully."})
