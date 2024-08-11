
from django_filters import rest_framework as filters
from .models import Student

class StudentFilter(filters.FilterSet):
    name = filters.CharFilter(field_name='first_name', lookup_expr='icontains')
    email = filters.CharFilter(field_name='email', lookup_expr='icontains')

    class Meta:
        model = Student
        fields = ['first_name', 'email']
