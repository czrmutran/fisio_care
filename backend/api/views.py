from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .serializers.register_serializer import RegisterSerializer
from .serializers.user_serializer import UserSerializer

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]  # Permite que usuários não autenticados acessem

    def create(self, request, *args, **kwargs):
        register_serializer = self.get_serializer(data=request.data)
        register_serializer.is_valid(raise_exception=True)
        user = register_serializer.save()  # Cria o User e o Profile

        # Se quiser retornar todos os dados, inclusive do Profile:
        user_data = UserSerializer(user).data
        return Response(user_data, status=status.HTTP_201_CREATED)