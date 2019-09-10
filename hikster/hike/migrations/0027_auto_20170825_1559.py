# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-08-25 15:59
import django.contrib.gis.db.models.fields
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('hike', '0026_auto_20170817_2130'),
    ]

    operations = [
        migrations.AddField(
            model_name='event',
            name='exist_before',
            field=models.BooleanField(default=False, editable=False),
        ),
        migrations.AddField(
            model_name='trail',
            name='shape_2d',
            field=django.contrib.gis.db.models.fields.GeometryField(blank=True, null=True, srid=4326),
        ),
        migrations.AlterField(
            model_name='event',
            name='event_id',
            field=models.OneToOneField(db_column='event_id', on_delete=django.db.models.deletion.CASCADE, primary_key=True, serialize=False, to='hike.Trail'),
        ),
        migrations.AlterField(
            model_name='eventtrailsection',
            name='trailsection',
            field=models.ForeignKey(db_column='trailsection', on_delete=django.db.models.deletion.CASCADE, to='hike.TrailSection'),
        ),
    ]
