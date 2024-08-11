import { Component } from '@angular/core';
import { StudentService } from '../student.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrl: './student-list.component.css'
})
export class StudentListComponent {

  students: any[] = [];
  filteredStudents: any[] = [];
  searchName: string = '';
  searchEmail: string = '';

  constructor(private studentService: StudentService, private router: Router) { }

  ngOnInit() {
    this.loadStudents();
  }

  loadStudents() {
    this.studentService.getStudents().subscribe(data => {
      this.students = data;
      this.filteredStudents = data;
    });
  }

  onSearch() {
    this.filteredStudents = this.students.filter(student =>
      (this.searchName ? student.first_name.toLowerCase().includes(this.searchName.toLowerCase()) || student.last_name.toLowerCase().includes(this.searchName.toLowerCase()) : true) &&
      (this.searchEmail ? student.email.toLowerCase().includes(this.searchEmail.toLowerCase()) : true)
    );
  }

  viewStudent(id: string) {

    this.router.navigate([`/students/${id}`]);
  }

  editStudent(id: string) {
    this.router.navigate(['/edit', id]);
  }

  deleteStudent(id: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.studentService.deleteStudent(id).subscribe(() => {
          Swal.fire('Deleted!', 'The student has been deleted.', 'success');
          this.filteredStudents = this.students.filter(student => student.id !== id);
        });
      }
    });
  }

}
