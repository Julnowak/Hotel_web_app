# Generated by Django 5.1.2 on 2024-11-13 16:13

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0014_payment'),
    ]

    operations = [
        migrations.AlterField(
            model_name='reservation',
            name='room_floor',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='room_floor', to='users.floor'),
        ),
    ]