# -*- coding: utf-8 -*-
# Generated by Django 1.10.8 on 2018-08-09 17:43
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('hike', '0039_auto_20180724_1857'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='activity',
            options={'verbose_name': 'Activity', 'verbose_name_plural': 'Activities'},
        ),
    ]
