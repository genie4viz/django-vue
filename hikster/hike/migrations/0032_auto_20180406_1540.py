# -*- coding: utf-8 -*-
# Generated by Django 1.10.8 on 2018-04-06 15:40
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('hike', '0031_trailsectionactivities'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='trailsectionactivities',
            name='trailsection_id',
        ),
        migrations.AddField(
            model_name='trail',
            name='trailsection_activities_uuid',
            field=models.CharField(blank=True, max_length=60, null=True),
        ),
        migrations.AddField(
            model_name='trailsectionactivities',
            name='trailsection_uuid',
            field=models.CharField(blank=True, max_length=60, null=True),
        ),
    ]
