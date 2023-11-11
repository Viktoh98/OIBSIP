from django.db import models
from django.conf import settings


class Task (models.Model):
    title = models.CharField(max_length=50)
    detail = models.TextField()
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now=False, auto_now_add=True)
    due_date = models.DateField(auto_now=False, auto_now_add=False)
    isCompleted = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.title} {self.created_at}"
