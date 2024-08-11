import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Student } from './model/student.model';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private apiUrl = 'http://localhost:8000/api/students/';

  constructor(private http: HttpClient) { }

  createStudent(student: any): Observable<any> {
    return this.http.post(this.apiUrl, student);
  }

  getStudents(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getStudent(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}${id}/`);
  }

  deleteStudent(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}${id}/`);
  }

  updateStudent(id: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}${id}/`, data);
  }

  checkEmailExists(email: string): Observable<{ exists: boolean }> {
    const params = new HttpParams().set('email', email);
    return this.http.get<{ exists: boolean }>(`${this.apiUrl}check-email/`, { params });
  }
}
