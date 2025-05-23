from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import Consultation, Fisioterapeuta, CustomUser
from .serializers import (
    RegisterSerializer, 
    UserSerializer,
    ConsultationSerializer, 
    FisioterapeutaSerializer
)

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

class UserView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

class ConsultationListCreateView(generics.ListCreateAPIView):
    serializer_class = ConsultationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Only return consultations for the current user
        return Consultation.objects.filter(patient=self.request.user)
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context

class ConsultationDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ConsultationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Only allow access to the user's own consultations
        return Consultation.objects.filter(patient=self.request.user)

class FisioterapeutaView(APIView):
    def get(self, request):
        fisioterapeutas = Fisioterapeuta.objects.all()
        serializer = FisioterapeutaSerializer(fisioterapeutas, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = FisioterapeutaSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)