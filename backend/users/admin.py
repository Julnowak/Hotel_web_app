from django.contrib import admin
from .models import AppUser, Product

# Register your models here.
admin.site.register(AppUser)
admin.site.register(Product)