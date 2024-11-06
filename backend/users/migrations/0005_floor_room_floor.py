# Generated by Django 5.1.2 on 2024-11-06 17:30

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0004_rename_start_date_reservation_check_in_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Floor',
            fields=[
                ('floor_id', models.AutoField(primary_key=True, serialize=False)),
                ('hotel', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.hotel')),
            ],
        ),
        migrations.AddField(
            model_name='room',
            name='floor',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='users.floor'),
        ),
    ]