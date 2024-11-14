# Generated by Django 5.1.2 on 2024-11-14 01:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0016_reservation_people_number_room_people_capacity'),
    ]

    operations = [
        migrations.RenameField(
            model_name='payment',
            old_name='payment_date',
            new_name='payment_creation',
        ),
        migrations.AddField(
            model_name='payment',
            name='payment_realization',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='payment',
            name='status',
            field=models.CharField(default='Nieopłacone', max_length=200),
        ),
    ]
