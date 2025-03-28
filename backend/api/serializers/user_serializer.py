# myapp/serializers/user_serializer.py
from django.contrib.auth.models import User
from rest_framework import serializers
from ..serializers.profile_serializer import ProfileSerializer

class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ('username', 'profile')
