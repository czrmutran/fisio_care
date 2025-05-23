from rest_framework import serializers
from .models import CustomUser, Consultation, Fisioterapeuta
from django.contrib.auth.password_validation import validate_password

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    
    class Meta:
        model = CustomUser
        fields = ['username', 'password', 'name', 'email', 'cpf', 'rg', 'phone', 'address', 'birth_date']
    
    def create(self, validated_data):
        user = CustomUser.objects.create_user(**validated_data)
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'name', 'email', 'cpf', 'rg', 'phone', 'address', 'birth_date']
        read_only_fields = ['id']

class ConsultationSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.name', read_only=True)
    
    class Meta:
        model = Consultation
        fields = ['id', 'patient', 'patient_name', 'full_name', 'email', 'phone', 
                 'service', 'date', 'time', 'symptoms', 'status', 'created_at']
        read_only_fields = ['id', 'patient', 'patient_name', 'created_at']
    
    def create(self, validated_data):
        # Set the patient from the request
        validated_data['patient'] = self.context['request'].user
        return super().create(validated_data)

class FisioterapeutaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fisioterapeuta
        fields = '__all__'