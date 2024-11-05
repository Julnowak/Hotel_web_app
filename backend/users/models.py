from django.db import models
from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin


class AppUserManager(BaseUserManager):
    def create_user(self, email, username, password=None):
        if not email:
            raise ValueError('An email is required.')
        if not password:
            raise ValueError('A password is required.')
        email = self.normalize_email(email)
        user = self.model(email=email, username=username)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, username, password):
        """
        Creates and saves a superuser with the given email and password.
        """
        user = self.create_user(
            email,
            username=username,
            password=password,
        )
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


class AppUser(AbstractBaseUser, PermissionsMixin):
    user_id = models.AutoField(primary_key=True)
    email = models.EmailField(max_length=50, unique=True)
    username = models.CharField(max_length=50)
    user_type = models.CharField(max_length=50, default="klient")
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    objects = AppUserManager()

    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    def __str__(self):
        return self.username


class Hotel(models.Model):
    hotel_id = models.AutoField(primary_key=True)
    localization = models.CharField(default="Kraków", null=True, blank=True, max_length=200)
    phone = models.IntegerField(null=True, blank=True)
    address = models.CharField(null=True, blank=True, max_length=2000)

    def __str__(self):
        return "Hotel Weles " + self.localization + " "+ str(self.hotel_id)


class Room(models.Model):
    room_id = models.AutoField(primary_key=True)
    type = models.CharField(default="Standard", max_length=200)
    room_number = models.IntegerField()
    hotel = models.ForeignKey(Hotel, on_delete=models.CASCADE)

    def __str__(self):
        return "Pokój " + self.type + " " + str(self.room_id) + ", w hotelu " + str(Hotel.hotel_id)


class Reservation(models.Model):
    reservation_id = models.AutoField(primary_key=True)
    price = models.DecimalField(default=0.00, decimal_places=2, max_digits=100)
    status = models.CharField(default="Oczekująca", max_length=200)
    start_date = models.DateField()
    end_date = models.DateField()

    def __str__(self):
        return "Rezerwacja" + self.reservation_id + " " + str(self.id)
