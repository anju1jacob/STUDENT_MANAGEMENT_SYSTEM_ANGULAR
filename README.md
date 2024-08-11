# Student Management System 
## Objective 
Create an Angular application for a Student Management System with the ability to register, edit, 
list, delete and search student records. The application should include a registration form with 
specific fields and validation rules. The backend API for handling student records should be 
implemented using Django and Django REST Framework.

## Functionality 
##### Create Student: 
 Save the entered student information to the database.<br> 
 Generate a unique identifier for each student. <br> 
 Validate email uniqueness; if the email already exists, show an error message 
using SweetAlert (Swal). <br> 
##### Edit Student: 
 Retrieve and pre-fill the form with the existing student information. <br> 
 Allow updating and saving the changes. <br> 
##### List Students: 
 Display a list of registered students with their basic information. <br> 
 Provide an option to view detailed information or edit/delete each student. <br> 
##### Delete Student: 
 Remove a student's record from the system. <br> 
##### Search Students: 
 Implement a search functionality to filter the list of students based on name 
and email. 

### Technology Stack
Frontend -  Angular <br>
Backend - Django <br>
Database Integration: 
 Use Angular HttpClient to communicate with the backend server. <br>
 Set up the backend API using Django and Django REST Framework to handle <br>
CRUD operations on student records. 
