# -*- coding: utf-8 -*-
# Generated by Django 1.10.1 on 2016-12-21 17:14
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('hike', '0010_merge_20161221_1609'),
    ]

    operations = [
        migrations.AlterField(
            model_name='trail',
            name='objectid',
            field=models.IntegerField(null=True, unique=True),
        ),
    ]
