# Generated by Django 2.0.4 on 2018-11-27 00:32

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('location', '0028_auto_20181127_0032'),
        ('hike', '0053_remove_trail_images'),
        ('utils', '0011_auto_20181123_0141'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Image',
        ),
    ]
