import { Component, OnInit } from '@angular/core';
import { Student } from '../model/student.model';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService } from '../student.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-student-details',
  templateUrl: './student-details.component.html',
  styleUrl: './student-details.component.css'
})
export class StudentDetailsComponent implements OnInit {

  student!: Student;

  constructor(
    private route: ActivatedRoute,
    private studentService: StudentService,
    private router: Router
  ) { }



  ngOnInit(): void {
    const studentId = this.route.snapshot.paramMap.get('id');
    if (studentId) {
      this.studentService.getStudent(studentId).subscribe(data => {
        this.student = data;
      }, (error) => {
        if (error.status === 404) {
          Swal.fire('Error', 'No student matches the given ID.', 'error');
          this.router.navigate(['/error']);
        }
      });
    }
  }

  backToList() {
    this.router.navigate(['/']);
  }

}
