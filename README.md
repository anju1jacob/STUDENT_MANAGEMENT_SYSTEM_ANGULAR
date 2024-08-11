# Student Management System 
## Objective 
Create an Angular application for a Student Management System with the ability to register, edit, 
list, delete and search student records. The application should include a registration form with 
specific fields and validation rules. The backend API for handling student records should be 
implemented using Django and Django REST Framework.

## Functionality 
 Create Student: 
 Save the entered student information to the database. 
 Generate a unique identifier for each student. 
 Validate email uniqueness; if the email already exists, show an error message 
using SweetAlert (Swal). 
 Edit Student: 
 Retrieve and pre-fill the form with the existing student information. 
 Allow updating and saving the changes. 
 List Students: 
 Display a list of registered students with their basic information. 
 Provide an option to view detailed information or edit/delete each student. 
 Delete Student: 
 Remove a student's record from the system. 
 Search Students: 
 Implement a search functionality to filter the list of students based on name 
and email. 
