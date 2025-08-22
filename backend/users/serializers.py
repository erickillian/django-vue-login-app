from django.contrib.auth import get_user_model
from rest_framework import serializers
from better_profanity import profanity

User = get_user_model()

class UserSelfSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(max_length=User._meta.get_field("full_name").max_length, allow_blank=True, required=False)
    email = serializers.EmailField(allow_blank=False, required=False, read_only=True)

    class Meta:
        model = User
        fields = ["slug", "email", "full_name", "date_joined", "color_mode", "display_name"]
        read_only_fields = ["email", "date_joined", "slug", "display_name"]

    def validate_full_name(self, value: str):
        """Prevent bad words in full_name using better_profanity."""
        if profanity.contains_profanity(value):
            raise serializers.ValidationError("Inappropriate language is not allowed in your name.")
        return value
