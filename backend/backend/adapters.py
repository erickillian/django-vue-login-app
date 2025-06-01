import requests
from django.conf import settings
from rest_framework.exceptions import ValidationError
from allauth.account.adapter import DefaultAccountAdapter
from backend.settings import FRONTEND_URL, USE_HTTPS, PASSWORD_RESET_TIMEOUT
from users.serializers import UserSelfSerializer

class MyAccountAdapter(DefaultAccountAdapter):
    def get_password_reset_url(self, temp_key):
        # Construct your frontend URL here
        scheme = "https" if USE_HTTPS else "http"
        return f"{scheme}://{FRONTEND_URL}/reset-password/{temp_key}"
    
    def send_password_reset_mail(self, request, emailaddress, context):
        # Override the reset URL in the context using get_password_reset_url
        temp_key = context.get("key")
        user_id = context.get("user").pk
        scheme = "https" if USE_HTTPS else "http"
        context["password_reset_url"] =  f"{scheme}://{FRONTEND_URL}/reset-password/{user_id}-{temp_key}"
        context["password_reset_timeout_minutes"] = PASSWORD_RESET_TIMEOUT // 60  # Convert seconds to minutes
        super().send_password_reset_mail(request, emailaddress, context)

    def validate_signup(self, request, data):
        # Only validate hCaptcha if secret is configured
        if hasattr(settings, 'HCAPTCHA_SECRET') and settings.HCAPTCHA_SECRET:
            hcaptcha_token = data.get('hcaptcha_token')
            response = requests.post(
            'https://api.hcaptcha.com/siteverify',
            data={
                'secret': settings.HCAPTCHA_SECRET,
                'response': hcaptcha_token,
            }
            )
            result = response.json()
            if not result.get('success'):
                self.add_error(1, "Invalid hCaptcha. Please try again.")
                return
        # Call the original method to continue normal processing
        return super().validate_signup(request, data)
    