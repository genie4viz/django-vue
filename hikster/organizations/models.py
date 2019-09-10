from django.conf import settings
from django.db import models

from hikster.hike.models import Trail, TrailSection
from hikster.utils.models import Address
from hikster.location.models import PointOfInterest


class Organization(models.Model):
    name = models.CharField(max_length=128)
    contact = models.CharField(max_length=128, null=True, blank=True)
    address = models.OneToOneField(
        Address, null=True, blank=True, on_delete=models.CASCADE
    )

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name

    def get_location_shape_query(self):
        location_buffered_shapes = [
            location.shape.buffer(0.02)
            for location in self.locations.all()
            if location.shape is not None
        ]

        # Turn the list of location shapes into a list of Q objects
        queries = [models.Q(shape__within=shape) for shape in location_buffered_shapes]

        if not queries:
            return None

        # Take one Q object from the list
        query = queries.pop()
        # Or the Q object with the ones remaining in the list
        for item in queries:
            query |= item

        return query

    @property
    def trail_sections(self):
        query = self.get_location_shape_query()

        if query is None:
            return TrailSection.objects.none()

        return TrailSection.objects.filter(query)

    @property
    def point_of_interests(self):
        query = self.get_location_shape_query()

        if query is None:
            return PointOfInterest.objects.none()

        return PointOfInterest.objects.filter(query)

    @property
    def trails(self):
        return Trail.objects.filter(location__in=self.locations.all())


class OrganizationMember(models.Model):
    organization = models.ForeignKey(
        Organization, on_delete=models.CASCADE, related_name="members"
    )
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    class Meta:
        unique_together = ("organization", "user")

    def __str__(self):
        return "{} -> {}".format(self.organization, self.user)
