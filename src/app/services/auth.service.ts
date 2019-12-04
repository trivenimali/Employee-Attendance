import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { auth } from 'firebase/app';
import { User } from '../interface/user';
import * as firebase from 'firebase';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userData: any;    //save loggedIn user data

  constructor(public firestore: AngularFirestore,           //injecting firestore service
    public afauth: AngularFireAuth,                   //injecting firebase auth service
    public router: Router,  
    public ngZone: NgZone,
    public toast: ToastrService         
    )                           
  { 
    //saving user data in localstorage when logged in and setting up null when logged out 
  
    this.afauth.authState.subscribe(user=>{
      if(user)
      {
        this.userData=user;
        localStorage.setItem('user',JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user'));
      }
      else{
        localStorage.setItem('user', null);
        JSON.parse(localStorage.getItem('user'));
      }
    })
  }

    // Sign in with email/password
    SignIn(email, password) {
      return this.afauth.auth.signInWithEmailAndPassword(email, password)
        .then((result) => {
          //this.ngZone.run(() => {
            console.log(result);
            this.router.navigate(['dashboard']);
          //});
          this.SetUserData(result.user);
        }).catch((error) => {
          //window.alert(error.message)
        })
    } 
   
    // Sign up with email/password
  SignUp(email, password) {
    return this.afauth.auth.createUserWithEmailAndPassword(email, password)
      .then((result) => {
        console.log(result);
        
        this.SetUserData(result.user);
        this.router.navigate(['sign-in']);
      }).catch((error) => {
        window.alert(error.message)
      })
  }
  
 
  // Auth logic to run auth providers
  AuthLogin(provider) {
    return this.afauth.auth.signInWithPopup(provider)
    .then((result) => {
       this.ngZone.run(() => {
          this.router.navigate(['dashboard']);
        })
      //this.SetUserData(result.user);
      this.userAdd(this,result.user);
    }).catch((error) => {
      window.alert(error)
    })
  }

  //setting user data
  SetUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.firestore.collection('users').doc(`users/${user.uid}`);
    const userData: User = {
      uid: user.uid,
      name:user.name,
      email: user.email,
      phoneNo:user.phoneNo
     
     
    }
    return userRef.set(userData, {
      merge: true
    })
  }
 

  
  //Adding user
  userAdd(uid, value) {
    return this.firestore.collection('users').doc(uid).set(value);
  }

  // Sign out 
  SignOut() {
    return this.afauth.auth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['sign-in']);
      console.log(this.userData);
    })
  }

  //returns true when user is logged in 
  get isLoggedIn():boolean{
    const user= JSON.parse(localStorage.getItem('user'));
    return (user !== null)? true:false;
  }

  toastMessage() {
    this.toast.success("Record updated successfully..!");
  }
 


}























