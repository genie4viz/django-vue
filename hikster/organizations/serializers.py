from django.contrib.auth import get_user_model
from django.db import transaction

from rest_framework import serializers

from hikster.utils.serializers import AddressSerializer
from .models import Organization


class UserThinSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)

    class Meta:
        model = get_user_model()
        fields = ("first_name", "last_name", "email")


class OrganizationSerializer(serializers.ModelSerializer):
    address = AddressSerializer()

    class Meta:
        model = Organization
        fields = "__all__"


class OrgWithUserSerializer(OrganizationSerializer):

    user = UserThinSerializer(write_only=True)

    @transaction.atomic
    def update(self, instance, validated_data):
        address_data = validated_data.pop("address")
        address_serializer = AddressSerializer(instance.address, address_data)
        address_serializer.is_valid(raise_exception=True)
        address_serializer.save()

        user_data = validated_data.pop("user", None)

        if user_data is not None and self.context["request"]:
            user = self.context["request"].user
            user_serializer = UserThinSerializer(user, user_data)
            user_serializer.is_valid(raise_exception=True)
            user_serializer.save()

        for key, value in validated_data.items():
            setattr(instance, key, value)

        instance.save()
        return instance
