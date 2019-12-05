import { Component, OnInit,ElementRef } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomValidators } from '../../custome-validator';


@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  public frmSignin: FormGroup;
  isSubmitted: true;
  errorMessage;
  successMessage;
  email: string;
  password: string;


  constructor(public authService: AuthService, public router: Router, public fb: FormBuilder, private elementRef: ElementRef) {
    this.frmSignin = this.createSigninForm();
  }

  ngOnInit() {
    this.elementRef.nativeElement.ownerDocument.body.classList.add('loginBg');

  }
   public ngOnDestroy() {
    this.elementRef.nativeElement.ownerDocument.body.classList.remove('loginBg');
  } 



  createSigninForm(): FormGroup {
    return this.fb.group(
      {
        email: [
          null,
          Validators.compose([Validators.email, Validators.required])
        ],


        password: [
          null,
          Validators.compose([
            Validators.required,
            // check whether the entered password has a number
            CustomValidators.patternValidator(/\d/, {
              hasNumber: true
            }),

            Validators.minLength(8)
          ])
        ],

      },

    );
  }

  submit() {
    // do signup or something
    console.log(this.frmSignin.value);
  }

  login() {
    console.log(this, this.frmSignin.value);
    this.isSubmitted = true;

    this.authService.login(this.frmSignin.value).then(res => {
      console.log(res);
      this.router.navigate(['dashboard']);

    },

      err => {
        console.log(err);
        this.errorMessage = err.message;
        this.successMessage = "";
      })

  }

}
