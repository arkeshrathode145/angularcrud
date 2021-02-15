import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  dataChanged=new Subject<any>();
  constructor(private router:Router,route:ActivatedRoute,
    private http:HttpClient
    ) { }
 addStudent(form:any){
   return this.http.post('http://localhost:3000/students',form);
 }
 getAllStudents(){
   return this.http.get('http://localhost:3000/students')
 }
 deleteStudent(id:number){
   return this.http.delete('http://localhost:3000/students/'+id);
 }
 studentEdit(id:number){
  return this.http.get('http://localhost:3000/students/'+id);
 }
 studentUpdate(id:number,form){
   return this.http.put('http://localhost:3000/students/'+id,form);
 }
 getEmail(email:any){
   return this.http.get('http://localhost:3000/students?email='+email)
 }
}
