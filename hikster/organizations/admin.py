from django.contrib import admin
from . import models


class OrganizationMemberInlineAdmin(admin.TabularInline):
    model = models.OrganizationMember
    extra = 0
    raw_id_fields = ['user']


class OrganizationAdmin(admin.ModelAdmin):
    inlines = [OrganizationMemberInlineAdmin]


admin.site.register(models.Organization, OrganizationAdmin)
