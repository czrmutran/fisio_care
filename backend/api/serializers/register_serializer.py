# myapp/serializers/register_serializer.py
from django.contrib.auth.models import User
from rest_framework import serializers
from ..models import Profile

class RegisterSerializer(serializers.ModelSerializer):
    # Campos do Profile (write_only=True pois não precisamos retornar esses dados nesse momento)
    name = serializers.CharField(write_only=True, required=True)
    cpf = serializers.CharField(write_only=True, required=True)
    rg = serializers.CharField(write_only=True, required=True)
    phone = serializers.CharField(write_only=True, required=True)
    email = serializers.EmailField(write_only=True, required=True)
    address = serializers.CharField(write_only=True, required=True)
    birth_date = serializers.DateField(write_only=True, required=True)

    class Meta:
        model = User
        fields = (
            'username',      # Campo do User
            'password',      # Campo do User
            'name',
            'cpf',
            'rg',
            'phone',
            'email',
            'address',
            'birth_date',
        )
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def create(self, validated_data):
        # Extraindo os dados do Profile
        name = validated_data.pop('name')
        cpf = validated_data.pop('cpf')
        rg = validated_data.pop('rg')
        phone = validated_data.pop('phone')
        email = validated_data.pop('email')
        address = validated_data.pop('address')
        birth_date = validated_data.pop('birth_date')

        # Criando o User
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password']
        )
        
        # Criando o Profile associado
        Profile.objects.create(
            user=user,
            name=name,
            cpf=cpf,
            rg=rg,
            phone=phone,
            email=email,
            address=address,
            birth_date=birth_date
        )
        
        return user
