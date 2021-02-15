import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { StudentService } from './student.service';
import Swal from 'node_modules/sweetalert2/dist/sweetalert2.js';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit {
  studentData: any = [];
  error:string;
  editId: number;
  isLoading=false;
  isForm: boolean = false;
  newData: object;
  isEdit = false;
  config: any={
    itemsPerPage: 5,
      currentPage: 1,
      totalItems: this.studentData.length
  }
  genders: any = ['male', 'female'];
  studentForm: FormGroup;
  constructor(private studentServive: StudentService,
    private router: Router,
    private route: ActivatedRoute
  ) { }
  ngOnInit(): void {
    this.initForm();
    this.isLoading=true;
    this.studentServive.getAllStudents().subscribe(resData => {
      
      this.studentData = resData;
     this.isLoading=false;
    },error=>{
      this.error=error.message
    })

  }
  pageChanged(event){
    this.config.currentPage = event;
  }
  displayForm() {
    this.isForm = true;
  }
  initForm() {
    let hobbies = new FormArray([]);
    this.studentForm = new FormGroup({
      'name': new FormControl(null, Validators.required),
      'address': new FormControl(null, Validators.required),
      'email': new FormControl(null, [Validators.email, Validators.required]),
      'phonenumber': new FormControl(null, [Validators.required, Validators.pattern('[6-9]{1}[0-9]{9}')]),
      'gender': new FormControl(null, Validators.required),
      'education': new FormControl(null, Validators.required),
      'hobbies': hobbies
    });
  }
  addHobby() {
    (<FormArray>this.studentForm.get('hobbies')).push(
      new FormGroup({
        'hobbyname': new FormControl(null, Validators.required),
      })
    )
  }
  removeAt(index: number) {
    (<FormArray>this.studentForm.get('hobbies')).removeAt(index);
  }
  //submit the form
  onsubmit() {

    this.studentServive.addStudent(this.studentForm.value).subscribe(resData => {
      Swal.fire('Thank you...', 'You submitted succesfully!', 'success')
      this.studentServive.getAllStudents().subscribe(resData => {
        this.studentData = resData;
      });
      console.log(resData)

    }, error => {
      console.log(error);
    });
    this.studentForm.reset();

  }
  //End of submit form
  onDelete(id: number) {
    Swal.fire({
      title: 'Are you sure want to remove?',
      text: 'You will not be able to recover this file!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result: any) => {
      if (result.value) {
        this.studentServive.deleteStudent(id).subscribe(success => {
          this.studentServive.getAllStudents().subscribe(resData => {
            this.studentData = resData;
          });
        })
        Swal.fire(
          'Deleted!',
          'Your imaginary file has been deleted.',
          'success'
        )
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your Record  is safe :)',
          'error'
        )
      }
    })
    this.studentServive.getAllStudents().subscribe(resData => {
      this.studentData = resData;
    });
  }
  onEdit(id: number) {
    this.isEdit = true;
    this.isForm = true;
    this.editId = id;
    this.studentServive.studentEdit(id).subscribe((resdata: any) => {
      this.studentForm.controls['name'].setValue(resdata.name);
      this.studentForm.controls['email'].setValue(resdata.email);
      this.studentForm.controls['address'].setValue(resdata.address);
      this.studentForm.controls['phonenumber'].setValue(resdata.phonenumber);
      this.studentForm.controls['gender'].setValue(resdata.gender);
      console.log(resdata.hobbies);
      if (resdata.hobbies) {
        for (let hobby of resdata.hobbies) {
          (<FormArray>this.studentForm.get('hobbies')).push(
            new FormGroup({
              'hobbyname': new FormControl(hobby.hobbyname, Validators.required),
            })
          )
        }
      }
      this.studentForm.controls['education'].setValue(resdata.education);
    })
  }
  Update() {
    this.studentServive.studentUpdate(this.editId, this.studentForm.value).subscribe(resData => {
      Swal.fire('Thank you...', 'Updated  succesfully!', 'success')
      this.studentServive.getAllStudents().subscribe(resData => {
        this.studentData = resData;
      });
      console.log(resData)

    }, error => {
      console.log(error);
    });
    this.studentForm.reset();
    this.isEdit = false;
  }
  onClear(){
    this.studentForm.reset();
    this.isForm=false;
  }
}

