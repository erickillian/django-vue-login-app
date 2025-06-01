from django.contrib.auth.models import AbstractUser
from django.db import models
import random
import uuid

class User(AbstractUser):
    username = None
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=50, blank=True, default="")
    slug = models.SlugField(max_length=255, unique=True, blank=True, editable=False)
    color_mode = models.CharField(
        max_length=10,
        choices=[
            ("light", "Light"),
            ("dark", "Dark"),
            ("system", "System"),
        ],
        default="system",
    )

    PROFILE_PICTURE_OPTIONS = 12
    PROFILE_PICTURES = [i for i in range(1, PROFILE_PICTURE_OPTIONS + 1)]

    profile_picture = models.IntegerField(
        choices=[(pic, f"Profile {pic}") for pic in PROFILE_PICTURES],
        blank=True,
        null=True,
    )

    REQUIRED_FIELDS = []
    USERNAME_FIELD = 'email'

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = str(uuid.uuid4())
        if not self.profile_picture:
            self.profile_picture = random.choice(self.PROFILE_PICTURES)
        super().save(*args, **kwargs)

    @property
    def display_name(self):
        return self.full_name if self.full_name else self.email

    def __str__(self):
        return f"{self.display_name}"
