import json

from collections import defaultdict

from django.db.models import Value, BooleanField
from django.views.generic import TemplateView

from hikster.hike.models import Activity, Trail, TrailActivity
from hikster.location.utils import get_poi_categories


class SearchView(TemplateView):
    template_name = "website/search/result-page.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        activities = Activity.objects.values("id", "name").order_by("id")
        context["activities"] = list(activities)
        context["types"] = Trail.PATH_TYPES
        context["difficulties"] = TrailActivity.DIFFICULTY_CHOICES
        context["no_footer"] = True
        context["map_style"] = "results"
        context["poi_categories"] = get_poi_categories()
        context["default_sport"] = 1
        return context
