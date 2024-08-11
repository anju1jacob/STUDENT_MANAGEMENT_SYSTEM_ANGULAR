from rest_framework import serializers
from .models import Student, PreviousEducation

class PreviousEducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = PreviousEducation
        fields = ['previous_school', 'year_of_start', 'year_of_end']

class StudentSerializer(serializers.ModelSerializer):
    previous_education = PreviousEducationSerializer(many=True)
    subjects = serializers.ListField(child=serializers.CharField())

    class Meta:
        model = Student
        fields = '__all__'

    def create(self, validated_data):
        previous_education_data = validated_data.pop('previous_education')
        subjects = validated_data.pop('subjects', [])
        student = Student.objects.create(**validated_data, subjects=','.join(subjects))
        for education_data in previous_education_data:
            PreviousEducation.objects.create(student=student, **education_data)
        return student

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['subjects'] = instance.subjects.split(',') if instance.subjects else []
        return representation
    
    def update(self, instance, validated_data):
        previous_education_data = validated_data.pop('previous_education', [])
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.date_of_birth = validated_data.get('date_of_birth', instance.date_of_birth)
        instance.email = validated_data.get('email', instance.email)
        instance.address = validated_data.get('address', instance.address)
        instance.state = validated_data.get('state', instance.state)
        instance.city = validated_data.get('city', instance.city)
        instance.pincode = validated_data.get('pincode', instance.pincode)
        instance.subjects = ','.join(validated_data.get('subjects', instance.subjects.split(',')))
        instance.save()

         # Retrieve existing PreviousEducation instances
        existing_educations = {edu.id: edu for edu in PreviousEducation.objects.filter(student=instance)}

        # Process the incoming previous education data
        new_education_ids = set()

        for education_data in previous_education_data:
            edu_id = education_data.get('id', None)
            if edu_id:
                # Update existing education record
                edu_instance = existing_educations.pop(edu_id, None)
                if edu_instance:
                    edu_instance.previous_school = education_data.get('previous_school', edu_instance.previous_school)
                    edu_instance.year_of_start = education_data.get('year_of_start', edu_instance.year_of_start)
                    edu_instance.year_of_end = education_data.get('year_of_end', edu_instance.year_of_end)
                    edu_instance.save()
                    new_education_ids.add(edu_id)
            else:
                # Create new education record
                PreviousEducation.objects.create(student=instance, **education_data)
                
        PreviousEducation.objects.filter(student=instance, id__in=existing_educations.keys()).delete()
        return instance














# Extracts previous_education and subjects from validated_data.
# Creates the Student instance.
# Iterates through previous_education_data and creates PreviousEducation instances linked to the Student.
# Calls the parent to_representation method.
# Splits the subjects string into a list for a more user-friendly outpu