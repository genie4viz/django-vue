# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-02-16 15:23
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('location', '0016_location_deletion_pending'),
    ]

    operations = [
        migrations.AddField(
            model_name='location',
            name='slug',
            field=models.SlugField(blank=True, default='', max_length=300),
        ),
        migrations.AddField(
            model_name='pointofinterest',
            name='slug',
            field=models.SlugField(blank=True, default='', max_length=300),
        ),
    ]
