from . import views
from django.urls import path

urlpatterns = [
    path('register/', views.UserRegister.as_view(), name='register'),
    path('login/', views.UserLogin.as_view(), name='login'),
    path('logout/', views.UserLogout.as_view(), name='logout'),
    path('user/', views.UserView.as_view(), name='user'),
    path('rooms/', views.RoomApi.as_view(), name='rooms'),
    path('room/<int:pk>/', views.RoomApi.as_view(), name='room_view'),
]
