# Generated by Django 2.0.4 on 2018-08-23 01:13

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('hike', '0042_auto_20180812_1532'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='trail',
            name='activity',
        ),
        migrations.RemoveField(
            model_name='trail',
            name='difficulty',
        ),
    ]
