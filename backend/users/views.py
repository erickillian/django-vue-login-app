from rest_framework.response import Response
from rest_framework.views import APIView

from users.serializers import UserSelfSerializer


class UserSelfView(APIView):
    def get(self, request, *args, **kwargs):
        user = request.user
        serializer = UserSelfSerializer(user)
        return Response(serializer.data)

    def put(self, request, *args, **kwargs):
        user = request.user
        serializer = UserSelfSerializer(user, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        response_serializer = UserSelfSerializer(request.user)
        return Response(response_serializer.data)
