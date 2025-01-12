import datetime
from collections import defaultdict

from django.contrib.auth import login, logout, authenticate
from django.db.models import Sum
from django.db.models.functions import ExtractMonth, ExtractYear
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework.authentication import SessionAuthentication
from rest_framework.exceptions import ValidationError
from rest_framework.pagination import PageNumberPagination
from rest_framework.parsers import MultiPartParser, FormParser
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

        if AppUser.objects.filter(username=validated_data['username'].lower()):
            return Response({"error": "Wybrana nazwa użytkownika już istnieje."}, status=status.HTTP_401_UNAUTHORIZED)
        if AppUser.objects.filter(email=validated_data['email']):
            return Response({"error": "Istnieje już konto powiązane z tym adresem email."},status.HTTP_401_UNAUTHORIZED)
        if len(validated_data['password']) < 8:
            return Response({"error": "Hasło powinno mieć minimum 8 znaków."}, status=status.HTTP_401_UNAUTHORIZED)
        if validated_data['password'] != validated_data['confirmPassword']:
            return Response({"error": "Hasła nie są ze sobą zgodne."}, status=status.HTTP_401_UNAUTHORIZED)

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

        # Validate email and password
        assert validate_email(data)
        assert validate_password(data)

        serializer = UserLoginSerializer(data=data)
        if serializer.is_valid(raise_exception=True):
            user = authenticate(request, email=data['email'], password=data['password'])
            try:
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
                response.set_cookie(
                    key='csrftoken',
                    value=csrf_token,
                    samesite='None',  # Allow cross-origin requests
                    secure=False,  # Disable Secure for local testing
                    path='/'  # Path where the cookie is valid
                )
                return response
            except:
                return Response({"error": "Wprowadzono nieprawidłowy email lub hasło."}, status=status.HTTP_401_UNAUTHORIZED)


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

        new_list = dict()
        for i in list(serializer.data['liked_hotels']):
            new_list[i] = f'Hotel Weles {Hotel.objects.get(hotel_id = i).localization}'

        return Response({'user': serializer.data, "reservations_number": num, "total_days": total_days,
                         "mean_rating": mean_rating, "liked_hotels": new_list}, status=status.HTTP_200_OK)

    def post(self, request):
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
        floor_id = int(data.get('floor_num', 1))
        check_in_date = datetime.datetime.strptime(data['check_in'], "%Y-%m-%d").date()
        check_out_date = datetime.datetime.strptime(data['check_out'], "%Y-%m-%d").date()

        # Fetch all rooms based on criteria
        rooms = Room.objects.filter(
            hotel__hotel_id=hotel_id,
            floor__floor_number=floor_id
        ).order_by("room_number")

        # Prepare a list to store room data with availability status
        room_data = []
        print(rooms.values())
        for room in rooms:
            # Check if room has any conflicting reservations
            has_conflict = Reservation.objects.filter(
                room=room,
                check_in__lt=check_out_date,
                check_out__gt=check_in_date,
            ).exists()

            # Set availability status based on conflicts
            room_status = "Wolny" if (not has_conflict and not(room.status == "Do sprzątania" or room.status == "Do naprawy" )) else "Zajęty"
            # Append room data with the status to room_data
            room_data.append({
                "room_id": room.room_id,
                "room_number": room.room_number,
                "room_type": room.type,
                "status": room_status,
                "price": room.price,
                'capacity': room.people_capacity,
            })
        # Return the room data with availability status
        return Response(room_data, status=status.HTTP_200_OK)

    def put(self, request):
        data = request.data
        hotel_id = int(data['hotel_id'])
        rooms = Room.objects.filter(hotel__hotel_id=hotel_id, floor__hotel__hotel_id=hotel_id, floor__floor_number=data['floor_num'])

        # Serializacja danych
        serializer = RoomSerializer(rooms, many=True)

        # Return the room data with availability status
        return Response(serializer.data, status=status.HTTP_200_OK)

    def get(self, request):
        r = Room.objects.filter(hotel_id=int(request.GET['hotel_id'][0]), floor__floor_number=int(request.GET['floor'][0]))
        serializer = RoomSerializer(r, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


@method_decorator(csrf_exempt, name='dispatch')
class NewReservationApi(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request, pk):
        try:
            r = Room.objects.get(room_id=pk)
            check_in = datetime.datetime.strptime(request.GET.get('checkIn'), '%Y-%m-%d').date()
            check_out = datetime.datetime.strptime(request.GET.get('checkOut'), '%Y-%m-%d').date()
            h = Hotel.objects.get(hotel_id=r.hotel.hotel_id)

            if request.user.is_authenticated:
                username = request.user.username
                name = request.user.name
                surname = request.user.surname
                email = request.user.email
            else:
                username = '---'
                name = ''
                surname = ''
                email = ''

            return Response({
                "price": r.price,
                "check_out": check_out,
                "check_in": check_in,
                "user": username,
                "email": email,
                "user_name": name,
                "surname": surname,
                "room_floor": r.floor.floor_number,
                "room_number": r.room_number,
                "room_type": r.type,
                "people_number": 1,
                "people_capacity": r.people_capacity,
                "hotel": f"Hotel Weles {h.localization}",
                "deposit": h.deposit_percentage,
                "adres": f'{h.address} {h.localization}',
                "hotel_telephone": h.phone,
                "hotel_email": h.email
            }, status=status.HTTP_200_OK)
        except Room.DoesNotExist:
            return Response({"error": "Room not found"}, status=status.HTTP_404_NOT_FOUND)
        except Hotel.DoesNotExist:
            return Response({"error": "Hotel not found"}, status=status.HTTP_404_NOT_FOUND)

    def post(self, request, pk):
        r = Room.objects.get(room_id=pk)

        print(request.data)
        check_in = datetime.datetime.strptime(request.data.get('checkIn'), '%Y-%m-%d').date()
        check_out = datetime.datetime.strptime(request.data.get('checkOut'), '%Y-%m-%d').date()
        people_number = request.data.get('peopleNumber')

        if request.user.is_authenticated:

            new_res = Reservation.objects.create(price=float(request.data['price']), check_out=check_out, check_in=check_in,
                                                 user=request.user, room=r, room_floor=r.floor, people_number=people_number,
                                                 additions=request.data['additions'], deposit=float(request.data['deposit']))
        else:
            new_res = Reservation.objects.create(price=float(request.data['price']), check_out=check_out, check_in=check_in,
                                                 room=r, room_floor=r.floor,
                                                 people_number=people_number, deposit=float(request.data['deposit']),
                                                 optional_guest_data={'name': request.data['name'], 'surname': request.data['surname'], 'email': request.data['email']},
                                                 additions=request.data['additions'])
            Payment.objects.create(reservation=new_res)
            r.status = "Zajęty"
            r.save()

        serializer = ReservationSerializer(new_res)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        reservation = Reservation.objects.get(reservation_id=pk)
        reservation.status = "Anulowana"
        reservation.save()
        print(reservation)
        serializer = ReservationSerializer(reservation)
        return Response(serializer.data, status=status.HTTP_200_OK)


class RoomStatusChange(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def post(self, request, room_id):
        data = request.data
        r = Room.objects.get(room_id=room_id)
        r.status = data['newStatus']
        r.save()
        serializer = RoomSerializer(r)
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

        serializer = HotelSerializer(h, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class OneHotelApi(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def get(self, request, hotel_id):
        h = Hotel.objects.get(hotel_id=hotel_id)

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
        reservations = Reservation.objects.select_related('room__hotel').all().filter(user=request.user).order_by("-check_in")

        today = datetime.datetime.now().date()
        current_reservations = reservations.filter(
            check_in__lte=today,
            check_out__gte=today,
            status__in=["Opłacona", "W trakcie"]
        )

        # Serializacja danych
        serializer = ReservationSerializer(reservations, many=True)
        ser = ReservationSerializer(current_reservations, many=True)
        return Response({"main_data": serializer.data, "current_data": ser.data}, status=status.HTTP_200_OK)


class RoomStatuses(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    def get(self, request, hotel_id):
        try:
            rooms = Room.objects.filter(hotel__hotel_id=hotel_id, floor__hotel__hotel_id=hotel_id, floor__floor_number=int(request.GET['floor'][0]))
        except:
            rooms = Room.objects.filter(hotel__hotel_id=hotel_id)

        # Serializacja danych
        serializer = RoomSerializer(rooms, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class AvailableRoomsView(APIView):
    def get(self, request):
        available_rooms = Room.objects.filter(status="Wolny")
        serializer = RoomSerializer(available_rooms, many=True)
        return Response(serializer.data)


class ReservationDetailsAPI(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (SessionAuthentication,)

    # dla zmiany statusu zamówienia
    def post(self, request, reservation_id):
        operation_type = request.data["operation_type"]
        reservation = get_object_or_404(Reservation, reservation_id=int(reservation_id))
        if operation_type == "zapłata":
            reservation.status = "Opłacona"
            reservation.is_paid = True
            reservation.paid_amount = reservation.price
        elif operation_type == "anulowanie":
            reservation.status = "Anulowana"
        elif operation_type == "zapłata częściowa":
            reservation.status = "Opłacona częściowo"
            reservation.paid_amount = reservation.deposit
            reservation.is_paid = True
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
    permission_classes = (permissions.AllowAny,)
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
        reservations = Reservation.objects.filter(user=request.user).select_related('room__hotel').order_by("-check_in")
        paginated_reservations = paginator.paginate_queryset(reservations, request)
        serializer = ReservationSerializer(paginated_reservations, many=True)
        return paginator.get_paginated_response(serializer.data)


class RoomPricesView(APIView):
    def get(self, request):
        rooms = Room.objects.filter(hotel__hotel_id=request.GET['hotelId'])
        data = {
            room.room_number: {
                "room_number": room.room_number,
                "hotel_name": room.hotel.localization,
                "price": room.price,
                "room_type": room.type,
                "floor": room.floor.floor_number,
            }
            for room in rooms
        }
        serializer = RoomSerializer(rooms, many=True)
        return Response(serializer.data)

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


class ReservationViewSet(APIView):
    def get(self, request):
        reservations = Reservation.objects.filter(check_in__lte=datetime.datetime.today()).order_by('-check_in')
        serializer = ReservationSerializer(reservations, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class RecepcionistReservations(APIView):

    def get(self, request, hotel_id):
        reservations = Reservation.objects.filter(room__hotel__hotel_id=hotel_id).order_by("-check_in")
        serializer = ReservationSerializer(reservations, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ReceptionistReservation(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    def get(self, request, reservation_id):
        reservation = get_object_or_404(Reservation, reservation_id=reservation_id)
        serializer = ReservationSerializer(reservation)
        userSerializer = UserSerializer(reservation.user)
        roomSerializer = RoomSerializer(reservation.room)
        return Response({"reservation_data": serializer.data, "user_data": userSerializer.data,
                         "room_data": roomSerializer.data})

    def put(self, request, reservation_id):
        data = request.data

        res = Reservation.objects.get(reservation_id=reservation_id)
        res.status = data['status']
        res.people_number = data['people_number']
        res.check_in = datetime.datetime.strptime(data['check_in'], '%Y-%m-%d').date()
        res.check_out = datetime.datetime.strptime(data['check_out'], '%Y-%m-%d').date()
        try:
            res.user = AppUser.objects.get(username=data['guest'])
        except:
            pass
        res.price = data['price']
        res.is_paid = bool(data['is_paid'])
        res.paid_amount = data['paid_amount']
        res.save()

        print(data)

        serializer = ReservationSerializer(res)

        return Response(serializer.data, status=status.HTTP_200_OK)


class ProfitLossChart(APIView):

    def get(self, request, hotel_id):
        reservations = Reservation.objects.filter(room__hotel_id=hotel_id)
        serializer = ReservationSerializer(reservations, many=True)

        # Group by year and month, and calculate the total price for each
        monthly_prices = (
            reservations.annotate(
                month=ExtractMonth("check_in"),
                year=ExtractYear("check_in")
            )
                .values("year", "month")
                .annotate(total_price=Sum("price"))
                .order_by("year", "month")
        )

        h = Hotel.objects.get(hotel_id=hotel_id)
        # Fill missing months with 0 for continuity
        all_data = defaultdict(lambda: 0)
        for item in monthly_prices:
            all_data[f"{item['year']}-{item['month']:02d}"] = item["total_price"]

        all_data = dict(all_data)
        for k, v in all_data.items():
            h.earnings[k] = float(v)

        h.save()

        for k in all_data.keys():
            if k not in h.costs.keys():
                h.costs[k] = 0
        h.save()
        return Response({"reservations_data": serializer.data, "monthly_earnings": h.earnings, "monthly_costs": h.costs})

    def post(self, request, hotel_id):

        h = Hotel.objects.get(hotel_id=hotel_id)
        if request.data['data_type'] == 'earnings':
            h.earnings[request.data['month'][0]] = 0
            sorted_list = sorted(h.earnings.items())

            sorted_dict = {}
            for key, value in sorted_list:
                sorted_dict[key] = value
            h.earnings = sorted_dict
        else:
            h.costs[request.data['month'][0]] = 0
            sorted_list = sorted(h.costs.items())

            sorted_dict = {}
            for key, value in sorted_list:
                sorted_dict[key] = value
            h.costs = sorted_dict
        h.save()

        return Response(status=status.HTTP_200_OK)

    def put(self, request, hotel_id):
        h = Hotel.objects.get(hotel_id=hotel_id)
        if request.data['data_type'] == 'earnings':
            h.earnings[request.data['month']] = request.data['new_value']
        else:
            h.costs[request.data['month']] = request.data['new_value']
        h.save()

        return Response(status=status.HTTP_200_OK)


class Prices(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    def get(self, request, hotel_id):
        hotel = Hotel.objects.get(hotel_id=hotel_id)
        return Response(hotel.defaultPrices, status=status.HTTP_200_OK)

    def put(self, request, hotel_id):
        for k,v in request.data['prices'].items():
            rooms = Room.objects.filter(custom=False, type=k, hotel_id=hotel_id)
            for r in rooms:
                r.price = v
                r.save()
        hotel = Hotel.objects.get(hotel_id=hotel_id)
        hotel.defaultPrices = request.data['prices']
        hotel.save()
        return Response(status=status.HTTP_200_OK)


class RoomDetailView(APIView):
    def get(self, request, room_id):
        try:
            room = Room.objects.get(hotel_id=int(request.GET['hotel_id'][0]), room_number=room_id)
            serializer = RoomSerializer(room)

            return Response(serializer.data)
        except Room.DoesNotExist:
            return Response({"error": "Room not found"}, status=404)

    def put(self, request, room_id):

        room = Room.objects.get(room_id=room_id)
        room.type = request.data['type']
        room.status = request.data['status']
        room.people_capacity = int(request.data['people_capacity'])
        if request.data['custom']:
            room.price = int(request.data['price'])
        room.save()
        serializer = RoomSerializer(room)

        return Response(serializer.data, status=status.HTTP_200_OK)


class LikeApi(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    def post(self, request, hotel_id):
        user = request.user

        if Hotel.objects.get(hotel_id=hotel_id) in user.liked_hotels.all():
            user.liked_hotels.remove(Hotel.objects.get(hotel_id=hotel_id))
        else:
            user.liked_hotels.add(Hotel.objects.get(hotel_id=hotel_id))
        user.save()
        return Response(status=status.HTTP_200_OK)

    def get(self, request, hotel_id):
        h = Hotel.objects.get(hotel_id=hotel_id)
        user = request.user

        if h in user.liked_hotels.all():
            ans = True
        else:
            ans = False
        return Response({"ans": ans}, status=status.HTTP_200_OK)


class RoomAvailability(APIView):
    def get(self, request, room_id):
        room = Room.objects.filter(room_id=room_id)
        reservations = Reservation.objects.filter(room_id=room_id)

        formatted_data = [
            {"start": start.strftime("%Y-%m-%d"), "end": end.strftime("%Y-%m-%d")}
            for start, end in reservations.values_list("check_in", "check_out")
        ]


        serializer = ReservationSerializer(reservations, many=True)
        return Response({"periods": formatted_data, "reservations": serializer.data}, status=status.HTTP_200_OK)


class Search(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        try:
            res = Reservation.objects.get(reservation_id=int(request.data['reservation_id']))
            if res.user:
                if res.user.name == request.data['first_name'] and res.user.surname == request.data['last_name'] and res.user.email == request.data['email']:
                    serializer = ReservationSerializer(res)
                    return Response({"ans": serializer.data, "error": ""})
            else:
                if res.optional_guest_data['name'] == request.data['first_name'] and res.optional_guest_data['last_name'] == request.data['surname'] and res.optional_guest_data['email'] == request.data['email']:
                    serializer = ReservationSerializer(res)
                    return Response({"ans": serializer.data, "error": ""})
        except Reservation.DoesNotExist:
            return Response({"ans": None, "error": "Reservation not found"}, status=404)
        return Response({"ans": None, "error": ""})