from django.contrib import admin
from .models import AppUser, Hotel, Room, Reservation

# Register your models here.
admin.site.register(AppUser)
admin.site.register(Hotel)
admin.site.register(Room)
admin.site.register(Reservation)