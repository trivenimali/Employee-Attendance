import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  /* registerForm:FormGroup;
  isSubmitted:true;
  errorMessage;
  successMessage; */


  constructor(public authService:AuthService) { }

  ngOnInit() {
    /* this.registerForm=this.formBuilder.group({
      name:['',Validators.required],
      email:['',Validators.required, Validators.email],
      password:['',Validators.required],
      confirmPassword:['', Validators.required]
    }) */
  }



}
