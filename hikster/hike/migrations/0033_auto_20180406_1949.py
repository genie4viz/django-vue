# -*- coding: utf-8 -*-
# Generated by Django 1.10.8 on 2018-04-06 19:49
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('hike', '0032_auto_20180406_1540'),
    ]

    operations = [
        migrations.AlterField(
            model_name='trailsectionactivities',
            name='id',
            field=models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
    ]
