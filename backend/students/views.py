from rest_framework import viewsets
from .models import Student
from .serializers import StudentSerializer
from .filters import StudentFilter
from django_filters.rest_framework import DjangoFilterBackend

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_class = StudentFilter

    
