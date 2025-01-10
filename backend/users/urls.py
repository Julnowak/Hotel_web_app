from . import views
from django.urls import path

urlpatterns = [
    path('register/', views.UserRegister.as_view(), name='register'),
    path('login/', views.UserLogin.as_view(), name='login'),
    path('logout/', views.UserLogout.as_view(), name='logout'),
    path('user/', views.UserView.as_view(), name='user'),
    path('user/upload-avatar/', views.UploadAvatarView.as_view(), name='upload-avatar'),
    path('rooms/', views.RoomApi.as_view(), name='rooms'),
    path('roomAvailability/<int:room_id>', views.RoomAvailability.as_view(), name='roomAvailability'),
    path('hotels/', views.HotelApi.as_view(), name='hotels'),
    path('rooms/available/', views.AvailableRoomsView.as_view(), name='available_rooms'),
    path('roomStatusChange/<int:room_id>', views.RoomStatusChange.as_view(), name='room_status_change'),
    path('rooms/prices/', views.RoomPricesView.as_view(), name='prices_rooms'),
    path('manage/room/<int:room_id>/', views.RoomDetailView.as_view(), name='manage_room'),
    path('rooms/<int:hotel_id>/', views.RoomStatuses.as_view(), name='rooms_by_hotel'),
    path('hotel/<int:hotel_id>/', views.OneHotelApi.as_view(), name='hotel'),
    path('floors/<int:hotel_id>', views.FloorApi.as_view(), name='floors'),
    path('newReservation/<int:pk>/', views.NewReservationApi.as_view(), name='new_reservation'),
    path('reservations/', views.ReservationsAPI.as_view(), name='reservations'),
    path('personelReservations/', views.ReservationViewSet.as_view(), name='personelReservations'),
    path('recepcionistReservations/<int:hotel_id>/', views.RecepcionistReservations.as_view(), name='recepcionistReservations'),
    path('userReservations/', views.UserReservationsView.as_view(), name='user_reservations'),
    path('reservation/<int:reservation_id>/', views.ReservationDetailsAPI.as_view(), name='reservation'),
    path('receptionist/reservation/<int:reservation_id>/', views.ReceptionistReservation.as_view(), name='receptionistReservation'),
    path('reviews/', views.ReviewsApi.as_view(), name='reviews'),
    path('chart_data/<int:hotel_id>', views.ProfitLossChart.as_view(), name='chart_data'),
    path('prices/<int:hotel_id>/', views.Prices.as_view(), name='prices'),
    path('like/<int:hotel_id>/', views.LikeApi.as_view(), name='like'),

]
