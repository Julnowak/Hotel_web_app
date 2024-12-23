# Generated by Django 5.1.2 on 2024-11-13 14:10

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0011_hotel_latitude_hotel_longitude'),
    ]

    operations = [
        migrations.CreateModel(
            name='Review',
            fields=[
                ('review_id', models.AutoField(primary_key=True, serialize=False)),
                ('rating', models.DecimalField(decimal_places=2, default=0.0, max_digits=3)),
                ('description', models.TextField(default='Opis nie został jeszcze wprowadzony.')),
                ('hotel', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.hotel')),
                ('room', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='users.room')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
