from django.core.management.base import BaseCommand
from hikster.hike.models import Trail
from hikster.location.models import Location
from hikster.search.models import Index


class Command(BaseCommand):
    help = 'Re-builds the index table'

    def handle(self, *args, **options):
        self.stdout.write('Adding locations...')
        for location in Location.objects.all():
            self.stdout.write('  {}'.format(location))
            Index.objects.add(location)

        self.stdout.write('Adding trails...')
        for trail in Trail.objects.all():
            self.stdout.write('  {}'.format(trail))
            Index.objects.add(trail)
