from haystack.query import SearchQuerySet
from rest_framework.generics import ListAPIView

from .models import Index
from .serializers import IndexSerializer


class SearchView(ListAPIView):
    serializer_class = IndexSerializer

    def get_queryset(self):
        search_term = self.request.GET.get('search_term', None)
        if not search_term:
            return Index.objects.none()

        sqs = SearchQuerySet().auto_query(search_term)
        id_list = [result.id for result in sqs]

        return Index.objects.filter(id__in=id_list)
