from rest_framework import viewsets

from .models import Organization
from .serializers import OrgWithUserSerializer


class OrganizationViewSet(viewsets.ModelViewSet):
    queryset = Organization.objects.all()
    serializer_class = OrgWithUserSerializer

    def get_queryset(self):
        return self.queryset.filter(members__user=self.request.user)
