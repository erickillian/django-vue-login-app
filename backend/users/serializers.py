from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()

profile_picture_prefix = "/static/profile_pictures/"

class UserSelfSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(max_length=100, allow_blank=True, required=False)
    email = serializers.EmailField(allow_blank=False, required=False, read_only=True)
    profile_picture = serializers.ChoiceField(choices=User.PROFILE_PICTURES, allow_blank=False, required=False)

    def to_internal_value(self, data):
        if "profile_picture" in data:
            profile_picture = data["profile_picture"]
            if profile_picture.startswith(profile_picture_prefix):
                data["profile_picture"] = profile_picture[len(profile_picture_prefix) :]
        return super().to_internal_value(data)

    def to_representation(self, instance):
        if instance.profile_picture:
            instance.profile_picture = (
                f"{profile_picture_prefix}{instance.profile_picture}"
            )
        return super().to_representation(instance)

    class Meta:
        model = User
        fields = ["slug", "email", "full_name", "date_joined", "color_mode", "profile_picture", "display_name"]
        read_only_fields = ["email", "date_joined", "slug", "display_name"]
