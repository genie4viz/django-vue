# Generated by Django 2.1.5 on 2019-04-16 05:28

import django.contrib.gis.db.models.fields
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('hike', '0059_remove_difficulty_in_trailsection_trigger'),
    ]

    operations = [
        migrations.CreateModel(
            name='TrailStep',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('point', django.contrib.gis.db.models.fields.PointField(srid=4326)),
                ('order', models.SmallIntegerField()),
                ('trail', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='steps', to='hike.Trail')),
            ],
            options={
                'verbose_name': 'Trail Step',
                'verbose_name_plural': 'Trail Steps',
            },
        ),
    ]
