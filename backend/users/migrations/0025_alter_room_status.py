# Generated by Django 5.1.2 on 2025-01-04 19:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0024_hotel_defaultprices'),
    ]

    operations = [
        migrations.AlterField(
            model_name='room',
            name='status',
            field=models.CharField(default='Wolny', max_length=200),
        ),
    ]