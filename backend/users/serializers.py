from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()

class UserSelfSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(max_length=100, allow_blank=True, required=False)
    email = serializers.EmailField(allow_blank=False, required=False, read_only=True)

    class Meta:
        model = User
        fields = ["slug", "email", "full_name", "date_joined", "color_mode", "display_name"]
        read_only_fields = ["email", "date_joined", "slug", "display_name"]
