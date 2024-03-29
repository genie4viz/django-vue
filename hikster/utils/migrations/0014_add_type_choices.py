# Generated by Django 2.1.5 on 2019-03-06 14:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('utils', '0013_update_contact_type'),
    ]

    operations = [
        migrations.AlterField(
            model_name='contact',
            name='type',
            field=models.CharField(blank=True, choices=[('blog', 'Blog'), ('cellular', 'Cellular'), ('email', 'Email'), ('facebook', 'Facebook'), ('fax', 'Fax machine'), ('site', 'Site'), ('site_mobile', 'Site mobile'), ('telephone', 'Telephone'), ('telephone_no_charge', 'Telephone no charge'), ('telephone_secondary', 'Telephone secondary'), ('twitter', 'Twitter')], max_length=30),
        ),
    ]
