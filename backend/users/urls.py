from django.urls import path
from users.views import *

urlpatterns = [
    path("self", UserSelfView.as_view(), name="user_self"),
]
