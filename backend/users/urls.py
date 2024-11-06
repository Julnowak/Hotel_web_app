from . import views
from django.urls import path

urlpatterns = [
    path('register/', views.UserRegister.as_view(), name='register'),
    path('login/', views.UserLogin.as_view(), name='login'),
    path('logout/', views.UserLogout.as_view(), name='logout'),
    path('user/', views.UserView.as_view(), name='user'),
    path('rooms/', views.RoomApi.as_view(), name='rooms'),
    path('hotels/', views.HotelApi.as_view(), name='hotels'),
    path('floors/<int:hotel_id>', views.FloorApi.as_view(), name='floors'),
    path('newReservation/<int:pk>/', views.NewReservationApi.as_view(), name='new_reservation'),
]
