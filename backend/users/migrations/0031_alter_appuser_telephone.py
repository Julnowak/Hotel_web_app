# Generated by Django 5.1.2 on 2025-01-05 01:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0030_reservation_paid_amount'),
    ]

    operations = [
        migrations.AlterField(
            model_name='appuser',
            name='telephone',
            field=models.CharField(blank=True, max_length=15, null=True),
        ),
    ]
