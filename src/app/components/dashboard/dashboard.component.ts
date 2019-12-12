import { Component, OnInit, ElementRef, PipeTransform, Pipe } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { DatePipe } from '@angular/common';
import * as firebase from 'firebase';
import { User } from '../../interface/user';

import { timestamp } from 'rxjs/operators';
import * as moment from 'moment';
import { switchMap } from 'rxjs/operators';
declare var require: any;
export type FirestoreTimestamp = import("firebase").firestore.Timestamp;



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  todayNumber: number = Date.now();
  ref1: any;
  ref2:any;
  userId: any;
  user$: Observable<any>;

  constructor(public firestore: AngularFirestore,           //injecting firestore service
    public afauth: AngularFireAuth,                   //injecting firebase auth service
    public router: Router, public authService: AuthService,
    private elementRef: ElementRef,
    private datePipe: DatePipe) {

    this.afauth.authState.subscribe(user => {
      if (user) {
        this.userId = user.uid
        console.log(this.userId);
        this.ref1 = firestore.doc<any>(`users/${this.userId}`).collection('attendance');
        console.log(this.ref1);
      }
    })

    this.ref2=firestore.doc<User>(`users/${this.userId}`).collection('attendance').valueChanges();
    console.log(this.ref2);
  }


  ngOnInit() {
    this.user$ = this.authService.user$;
    this.elementRef.nativeElement.ownerDocument.body.classList.add('loginBg');    //for background image

  }

  public ngOnDestroy() {
    this.elementRef.nativeElement.ownerDocument.body.classList.remove('loginBg');   //for background image
  }

  punchOutTime() {
    const time1 = {
      //punchIn:firebase.firestore.FieldValue.serverTimestamp(), 
      punchOut: moment().format('LTS')
    }
    this.ref1.add(time1);
    console.log(time1);

  }

  punchInTime() {
    const time2 = {
      punchIn: moment().format('LTS')
    }
    this.ref1.add(time2);
    console.log(time2);

  }

}
