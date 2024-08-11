import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { StudentService } from '../student.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

// interface PreviousEducation {
//   previous_school: string;
//   year_of_start: string;
//   year_of_end: string;
// }

@Component({
  selector: 'app-student-registration',
  templateUrl: './student-registration.component.html',
  styleUrls: ['./student-registration.component.css']
})
export class StudentRegistrationComponent implements OnInit {

  registrationForm!: FormGroup;
  submitted = false;
  states = ['Kerala', 'Tamil Nadu', 'Karnataka', 'Telangana', 'Andhra Pradesh'];
  cities: string[] = [];
  subjects = ['Python', 'Django', 'MySql', 'Angular'];
  subjectSelected = false;
  errorMessage: string | null = null;

  constructor(private studentService: StudentService, private router: Router, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.registrationForm = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      date_of_birth: ['', [Validators.required]],  
      email: ['', [Validators.required, Validators.email], [this.emailUniqueValidator.bind(this)]],
      address: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      pincode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
      subjects: [''],
      previous_education: this.formBuilder.array([])
    });

    this.onStateChange();
  }

  get f() {
    return this.registrationForm.controls;
  }

  get previous_education() {
    return this.registrationForm.get('previous_education') as FormArray;
  }

  onStateChange() {
    const stateControl = this.registrationForm.get('state');
    if (stateControl) {
      const selectedState = stateControl.value;
      this.cities = [];

      if (selectedState === 'Kerala') {
        this.cities = ['Kochi', 'Trivandrum', 'Kottayam', 'Trissur', 'Kannur'];
      } else if (selectedState === 'Tamil Nadu') {
        this.cities = ['Chennai', 'Coimbatore', 'Selam', 'Tiruppur', 'Madurai'];
      } else if (selectedState === 'Karnataka') {
        this.cities = ['Bangalore', 'Mysore', 'Ballari', 'Udupi'];
      } else if (selectedState === 'Telangana') {
        this.cities = ['Hyderabad', 'Warangal', 'Karimnagar', 'Medak'];
      } else if (selectedState === 'Andhra Pradesh') {
        this.cities = ['Vijayawada', 'Visakhapatnam', 'Tirupati', 'Nellore'];
      }
    }
  }

  onSubjectChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const selectedSubjects = this.registrationForm.get('subjects')?.value || [];

    if (target.checked) {
      selectedSubjects.push(target.value);
      // console.log(selectedSubjects)
    } else {
      const index = selectedSubjects.indexOf(target.value);
      if (index > -1) {
        selectedSubjects.splice(index, 1);
      }
    }
    this.registrationForm.get('subjects')?.setValue(selectedSubjects);
    this.subjectSelected = selectedSubjects.length > 0;
  }


  addPreviousEducation() {
    this.previous_education.push(this.formBuilder.group({
      previous_school: ['', Validators.required],
      year_of_start: ['', Validators.required],
      year_of_end: ['', Validators.required]
    }));
  }

  removePreviousEducation(index: number) {
    this.previous_education.removeAt(index);
  }

  onSubmit() {
    this.submitted = true;

    if (this.registrationForm.invalid || !this.subjectSelected) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please fill in all required fields.'
      });
      return;
    }

    const formData = this.registrationForm.value;
    // console.log(formData)
    formData.subjects = formData.subjects;
    // formData.date_of_birth = this.formatDate(formData.date_of_birth);

    // formData.previous_education = formData.previous_education.map((education: PreviousEducation) => ({
    //   ...education,
    //   year_of_start: this.formatDate(education.year_of_start),
    //   year_of_end: this.formatDate(education.year_of_end)
    // }));

    this.studentService.createStudent(formData).subscribe(
      data => {
        Swal.fire('Success', 'Student Registered Successfully', 'success');
        this.router.navigate(['/']);
      },
      error => {                   // error response received from the HTTP request.
        this.errorMessage = error.error && error.error.email && error.error.email[0] === 'student with this email already exists.'
          ? 'Email already exists'
          : 'Something went wrong';
        Swal.fire('Error', this.errorMessage, 'error');
      }

    );
  }

  // formatDate(date: string): string {
  //   return new Date(date).toISOString().split('T')[0];
  // }

  emailUniqueValidator(control: AbstractControl): Observable<ValidationErrors | null> { //the validator will asynchronously return either a validation error object or null if there are no errors.
    if (!control.value) {
      return of(null); // the user hasn't entered anything, the function immediately returns an observable of null
    }
    return this.studentService.checkEmailExists(control.value).pipe(       //service method should make an HTTP request to the backend to check if the email exists in the database.
      map((response: any) => (response.exists ? { emailTaken: true } : null)),
      catchError(() => of(null)) // Handle errors
    );
  }
}


// map: Transforms the response from the backend.
// response.exists: This is assumed to be a boolean indicating if the email exists.
// If response.exists is true, it returns { emailTaken: true }, indicating a validation error because the email is already taken.
// If response.exists is false, it returns null, indicating no validation error.
//catchError: Catches any errors that occur during the HTTP request.
// If an error occurs (e.g., network issues, server errors), it returns an observable of null.

