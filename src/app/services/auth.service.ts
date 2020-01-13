import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { User } from '../interface/user';
import * as firebase from 'firebase';
import { AngularFirestore } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import { Observable, of, } from 'rxjs';
import { switchMap } from 'rxjs/operators';
const geolib = require('geolib');



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userData: any;                                            //save loggedIn user data
  user$: Observable<User>;
  //for accessing field of interface 


  constructor(public firestore: AngularFirestore,           //injecting firestore service
    public afauth: AngularFireAuth,               //injecting firebase auth service
    public router: Router,
    public toast: ToastrService) {


    //saving user data in localstorage when logged in and setting up null when logged out 
    this.afauth.authState.subscribe(user => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user'));
      }
      else {
        localStorage.setItem('user', null);
        JSON.parse(localStorage.getItem('user'));
      }
    })

    this.user$ = this.afauth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.firestore.doc<any>(`users/${user.uid}`).valueChanges();

        } else {
          return of(null);
        }
      })
    );


  }

  // Sign in with email/password
  login(value) {
    console.log(value);
    return this.afauth.auth.signInWithEmailAndPassword(value.email, value.password);
  }

  // Sign up with email/password
  register(value) {
    console.log(value);
    return firebase.auth().createUserWithEmailAndPassword(value.email, value.password)
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

  //return true when user is logged in
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return (user !== null) ? true : false;
  }

  //method for getting latitude and longitude
  getLocation(): Promise<any> {

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resp => {
        resolve({ lng: resp.coords.longitude, lat: resp.coords.latitude });
      },
        err => {
          reject(err);
        });
    });
  }
}