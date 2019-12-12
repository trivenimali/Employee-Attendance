import { Component, OnInit, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomValidators } from '../../custome-validator';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  public frmSignup: FormGroup;
  isSubmitted: true;
  errorMessage;
  successMessage;

  constructor(public fb: FormBuilder, public router:Router, public authService:AuthService,private elementRef: ElementRef) { 
    this.frmSignup = this.createSignupForm();
  }

  ngOnInit() {
    this.elementRef.nativeElement.ownerDocument.body.classList.add('loginBg');
  }

  public ngOnDestroy() {
    this.elementRef.nativeElement.ownerDocument.body.classList.remove('loginBg');
  }


  createSignupForm(): FormGroup {
    return this.fb.group(
      {

        name: [
          null,
          Validators.compose([ Validators.required])
        ],
        email: [
          null,
          Validators.compose([Validators.email, Validators.required])
        ],

        phone: [
          null,
          Validators.compose([ Validators.required])
        ],
        password: [
          null,
          Validators.compose([
            Validators.required,
            // check whether the entered password has a number
            CustomValidators.patternValidator(/\d/, {
              hasNumber: true
            }),
            // check whether the entered password has upper case letter
           /*  CustomValidators.patternValidator(/[A-Z]/, {
              hasCapitalCase: true
            }), */
            // check whether the entered password has a lower case letter
            /* CustomValidators.patternValidator(/[a-z]/, {
              hasSmallCase: true
            }), */
            // check whether the entered password has a special character
            /* CustomValidators.patternValidator(
              /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
              {
                hasSpecialCharacters: true
              }
            ), */
            Validators.minLength(8)
          ])
        ],
        confirmPassword: [null, Validators.compose([Validators.required])]
      },
      {
        // check whether our password and confirm password match
        validator: CustomValidators.passwordMatchValidator
      }
    );
  }

  submit() {
    // do signup or something
    console.log(this.frmSignup.value);
  }

  get f () { 
    console.log(this.frmSignup.controls);
    return this.frmSignup.controls; 
  }

  register() {
    console.log(this, this.frmSignup.value);
    this.isSubmitted = true;
    this.authService.register(this.frmSignup.value).then(res => {
      console.log(res);

      const user =
      {
        name: this.frmSignup.value.name,
        email: this.frmSignup.value.email,
        phone:this.frmSignup.value.phone,
      }

      this.authService.userAdd(res.user.uid, user).then(res => {
        console.log("success");
        this.router.navigate(['sign-in']);

      });
    },
      err => {
        console.log(err);
        this.errorMessage = err.message;
        this.successMessage = "";
      })
  }


}
