# Generated by Django 2.0.4 on 2018-11-28 23:58

from django.db import migrations
import easy_thumbnails.fields
import hikster.utils.models


class Migration(migrations.Migration):

    dependencies = [
        ('hike', '0054_auto_20181127_0033'),
    ]

    operations = [
        migrations.AlterField(
            model_name='trailimage',
            name='image',
            field=easy_thumbnails.fields.ThumbnailerImageField(max_length=300, upload_to=hikster.utils.models.get_image_upload_to),
        ),
    ]
