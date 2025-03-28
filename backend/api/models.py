from django.db import models
from django.contrib.auth.models import User

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    cpf = models.CharField(max_length=14)
    rg = models.CharField(max_length=12)
    phone = models.CharField(max_length=15)
    email = models.EmailField()
    address = models.CharField(max_length=255)
    birth_date = models.DateField()

    def __str__(self):
        return f"Profile de {self.user.username}"