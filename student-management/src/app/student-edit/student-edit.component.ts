import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl, ValidationErrors } from '@angular/forms';
import { StudentService } from '../student.service';
import Swal from 'sweetalert2';
import { catchError, map, Observable, of } from 'rxjs';

@Component({
  selector: 'app-student-edit',
  templateUrl: './student-edit.component.html',
  styleUrls: ['./student-edit.component.css']
})
export class StudentEditComponent implements OnInit {
  editForm!: FormGroup;
  studentId: string | null = null;
  states = ['Kerala', 'Tamil Nadu', 'Karnataka', 'Telangana', 'Andhra Pradesh'];
  cities: string[] = [];
  subjects = ['Python', 'Django', 'MySql', 'Angular'];
  selectedSubjects: Set<string> = new Set();
  submitted = false;
  errorMessage: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private studentService: StudentService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.studentId = this.route.snapshot.paramMap.get('id');
    if (this.studentId) {
      this.loadStudent(this.studentId);
    }

    this.editForm = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      date_of_birth: ['', Validators.required],
      email: ['', [Validators.required, Validators.email], [this.emailUniqueValidator.bind(this)]],
      address: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      pincode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
      subjects: [''],
      previous_education: this.formBuilder.array([])
    });

    this.editForm.get('state')?.valueChanges.subscribe(state => {
      this.onStateChange(state);
    });
  }

  loadStudent(id: string) {
    this.studentService.getStudent(id).subscribe(data => {
      this.editForm.patchValue(data);
      this.setPreviousEducation(data.previous_education);
      this.selectedSubjects = new Set(data.subjects || []); // Update selectedSubjects
      this.updateSubjects();
      // Additional handling for subjects if needed
    }, (error) => {
      if (error.status === 404) {
        Swal.fire('Error', 'No student matches the given ID.', 'error');
        this.router.navigate(['/error']);
      }
    }
    );
  }

  onSubjectChange(event: any) {
    const subject = event.target.value;
    if (event.target.checked) {
      this.selectedSubjects.add(subject);
    } else {
      this.selectedSubjects.delete(subject);
    }
    this.updateSubjects(); // Update form array based on the selected subjects
  }

  updateSubjects() {
    const subjectsArray = this.editForm.get('subjects') as FormArray;
    subjectsArray.clear(); // Clear the form array before adding new values

    // Add selected subjects to the form array
    this.selectedSubjects.forEach(subject => {
      subjectsArray.push(this.formBuilder.control(subject));
    });
  }

  setPreviousEducation(previousEducation: any[]) {
    const previousEducationArray = this.editForm.get('previous_education') as FormArray;
    previousEducation.forEach(education => {
      previousEducationArray.push(this.formBuilder.group({
        previous_school: [education.previous_school, Validators.required],
        year_of_start: [education.year_of_start, Validators.required],
        year_of_end: [education.year_of_end, Validators.required]
      }));
    });
  }

  onStateChange(state: string) {
    if (state === 'Kerala') {
      this.cities = ['Kochi', 'Trivandrum', 'Kottayam', 'Trissur', 'Kannur'];
    } else if (state === 'Tamil Nadu') {
      this.cities = ['Chennai', 'Coimbatore', 'Selam', 'Tiruppur', 'Madurai'];
    } else if (state === 'Karnataka') {
      this.cities = ['Bangalore', 'Mysore', 'Ballari', 'Udupi'];
    } else if (state === 'Telangana') {
      this.cities = ['Hyderabad', 'Warangal', 'Karimnagar', 'Medak'];
    } else if (state === 'Andhra Pradesh') {
      this.cities = ['Vijayawada', 'Visakhapatnam', 'Tirupati', 'Nellore'];
    } else {
      this.cities = [];
    }
  }

  get previousEducationControls() {
    return (this.editForm.get('previous_education') as FormArray).controls;
  }

  addPreviousEducation() {
    const previousEducationArray = this.editForm.get('previous_education') as FormArray;
    previousEducationArray.push(this.formBuilder.group({
      previous_school: ['', Validators.required],
      year_of_start: ['', Validators.required],
      year_of_end: ['', Validators.required]
    }));
  }

  removePreviousEducation(index: number) {
    const previousEducationArray = this.editForm.get('previous_education') as FormArray;
    previousEducationArray.removeAt(index);
  }

  onSubmit() {
    this.submitted = true;
    if (this.editForm.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please fill in all required fields.'
      });
      return;
    }

    const formData = this.editForm.value;
    formData.subjects = Array.from(this.selectedSubjects);

    if (this.studentId) {
      this.studentService.updateStudent(this.studentId, formData).subscribe(
        () => {
          Swal.fire('Success', 'Student details updated successfully', 'success');
          this.router.navigate(['/']);
        },
        error => {
          Swal.fire('Error', 'Something went wrong', 'error');
          this.errorMessage = error.error && error.error.email && error.error.email[0] === 'student with this email already exists.'
            ? 'Email already exists'
            : 'Something went wrong';
        }

      );
    } else {
      Swal.fire('Error', 'Student ID is missing', 'error');
    }
  }

  emailUniqueValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    if (!control.value) {
      return of(null); // Return null if control value is empty
    }
    return this.studentService.checkEmailExists(control.value).pipe(
      map((response: any) => (response.exists ? { emailTaken: true } : null)), // Adjust based on your API response
      catchError(() => of(null)) // Handle errors
    );
  }
}
