# Generated by Django 5.1.2 on 2025-01-10 16:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0032_hotel_costs_hotel_earnings'),
    ]

    operations = [
        migrations.AddField(
            model_name='hotel',
            name='deposit_percentage',
            field=models.DecimalField(decimal_places=4, default=0.2, max_digits=10),
        ),
    ]
