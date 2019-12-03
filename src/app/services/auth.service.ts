import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afauth: AngularFireAuth, private router:Router) //injecting firebase auth service 
  { }

  //function for signUp using email and password
  SignUp(email, password) {
    return this.afauth.auth.createUserWithEmailAndPassword(email, password)
      .then((result) => {
        window.alert("You have been registered successfully");
        console.log(result.user)
      }).catch((error) => {
        window.alert(error.message)
      })
  }

  //function for signIn using email and password
  SignIn(email, password){
    return this.afauth.auth.signInWithEmailAndPassword(email, password)
    .then((result)=>{
      this.router.navigate(['']);
    }).catch((error)=>{
      window.alert(error.message)
    })
  }
}
