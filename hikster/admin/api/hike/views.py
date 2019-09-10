from django_filters.rest_framework import DjangoFilterBackend, FilterSet
from rest_framework import parsers, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from hikster.admin.api.hike.serializers import (
    TrailAdminSerializer,
    TrailImageSerializer,
    TrailSectionAdminSerializer,
)
from hikster.hike.models import Trail, TrailSection

from hikster.admin.api.filters import TrailIdsFilterSet, TrailSectionIdsFilterSet
from hikster.admin.mixins import FileUploadViewMixin


class TrailSectionAdminViewSet(viewsets.ModelViewSet):
    queryset = TrailSection.objects.all()
    serializer_class = TrailSectionAdminSerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_class = FilterSet

    @action(
        methods=["delete"],
        detail=False,
        url_name="bulk-delete",
        url_path="bulk-delete",
        filterset_class=TrailSectionIdsFilterSet,
    )
    def bulk(self, request):
        self.filter_queryset(self.get_queryset()).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class TrailAdminViewSet(viewsets.ModelViewSet, FileUploadViewMixin):
    queryset = Trail.objects.all()
    serializer_class = TrailAdminSerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_class = FilterSet

    @action(
        methods=["post"],
        detail=True,
        url_path="upload-image",
        parser_classes=(parsers.FormParser, parsers.MultiPartParser),
        serializer_class=TrailImageSerializer,
    )
    def upload_image(self, request, pk=None):
        return self._file_upload(request, trail=self.get_object())

    @action(
        methods=["delete"],
        detail=False,
        url_name="bulk-delete",
        url_path="bulk-delete",
        filterset_class=TrailIdsFilterSet,
    )
    def bulk_delete(self, request):
        self.filter_queryset(self.get_queryset()).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def calculate_difficulty_and_duration(self, instance):
        for activity in instance.activities.all():
            activity.calculate_duration()
            activity.calculate_difficulty()
            activity.save()

    def perform_create(self, serializer):
        instance = serializer.save()
        self.calculate_difficulty_and_duration(instance)

    def perform_update(self, serializer):
        instance = serializer.save()
        self.calculate_difficulty_and_duration(instance)
