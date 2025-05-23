from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    name = models.CharField(max_length=255)
    cpf = models.CharField(max_length=14, blank=True)
    rg = models.CharField(max_length=20, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    birth_date = models.DateField(null=True, blank=True)

class Consultation(models.Model):
    STATUS_CHOICES = (
        ('agendada', 'Agendada'),
        ('confirmada', 'Confirmada'),
        ('concluida', 'Concluída'),
        ('cancelada', 'Cancelada'),
    )
    
    patient = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='consultations')
    full_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    service = models.CharField(max_length=100)
    date = models.DateField()
    time = models.TimeField()
    symptoms = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='agendada')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-date', '-time']
    
    def __str__(self):
        return f"{self.full_name} - {self.service} - {self.date}"

class Fisioterapeuta(models.Model):
    nome = models.CharField(max_length=100)
    cargo = models.CharField(max_length=100)
    crefito = models.CharField(max_length=50)
    telefone = models.CharField(max_length=20)
    email = models.EmailField()
    foto = models.URLField()
    
    def __str__(self):
        return self.nome