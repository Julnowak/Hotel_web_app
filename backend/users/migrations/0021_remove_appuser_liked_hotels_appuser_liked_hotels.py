# Generated by Django 5.1.2 on 2024-11-29 00:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0020_appuser_recepcionist_hotel_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='appuser',
            name='liked_hotels',
        ),
        migrations.AddField(
            model_name='appuser',
            name='liked_hotels',
            field=models.ManyToManyField(blank=True, null=True, related_name='liked_hotels', to='users.hotel'),
        ),
    ]
