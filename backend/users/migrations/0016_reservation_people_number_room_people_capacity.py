# Generated by Django 5.1.2 on 2024-11-14 01:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0015_alter_reservation_room_floor'),
    ]

    operations = [
        migrations.AddField(
            model_name='reservation',
            name='people_number',
            field=models.IntegerField(default=1),
        ),
        migrations.AddField(
            model_name='room',
            name='people_capacity',
            field=models.IntegerField(default=2),
        ),
    ]
