from . import views
from django.urls import path

urlpatterns = [
    path('register/', views.UserRegister.as_view(), name='register'),
    path('login/', views.UserLogin.as_view(), name='login'),
    path('logout/', views.UserLogout.as_view(), name='logout'),
    path('user/', views.UserView.as_view(), name='user'),
    path('user/upload-avatar/', views.UploadAvatarView.as_view(), name='upload-avatar'),
    path('rooms/', views.RoomApi.as_view(), name='rooms'),
    path('hotels/', views.HotelApi.as_view(), name='hotels'),
    path('hotel/<int:hotel_id>/', views.OneHotelApi.as_view(), name='hotel'),
    path('floors/<int:hotel_id>', views.FloorApi.as_view(), name='floors'),
    path('newReservation/<int:pk>/', views.NewReservationApi.as_view(), name='new_reservation'),
    path('reservations/', views.ReservationsAPI.as_view(), name='reservations'),
    path('csrf/', views.csrf, name='csrf'),
]
