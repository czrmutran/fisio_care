from django.urls import path
from .views import (
    RegisterView, 
    UserView,
    ConsultationListCreateView, 
    ConsultationDetailView,
    FisioterapeutaView
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('user/', UserView.as_view(), name='user'),
    path('consultations/', ConsultationListCreateView.as_view(), name='consultations-list'),
    path('consultations/<int:pk>/', ConsultationDetailView.as_view(), name='consultation-detail'),
    path('fisioterapeuta/', FisioterapeutaView.as_view(), name='fisioterapeuta'),
]