from django.db import models

class Student(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    date_of_birth = models.DateField()
    email = models.EmailField(unique=True)
    address = models.TextField()
    state = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    pincode = models.CharField(max_length=6)
    subjects = models.CharField(max_length=200)
    
class PreviousEducation(models.Model):
    student = models.ForeignKey(Student, related_name='previous_education', on_delete=models.CASCADE)
    previous_school = models.CharField(max_length=200)
    year_of_start = models.DateField()
    year_of_end = models.DateField()


