# Generated by Django 2.1.5 on 2019-06-28 07:44

import django.contrib.gis.db.models.fields
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('hike', '0062_auto_20190605_1424'),
    ]

    operations = [
        migrations.AlterField(
            model_name='event',
            name='shape_2d',
            field=django.contrib.gis.db.models.fields.GeometryField(default=None, null=True, srid=4326),
        ),
    ]
