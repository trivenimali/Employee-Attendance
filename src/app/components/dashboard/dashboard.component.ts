import { Component, OnInit, ElementRef, PipeTransform, Pipe } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import * as firebase from 'firebase';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  todayNumber: number = Date.now();
  ref1: any;
  ref2: any;
  ref3: any;
  userId: any;
  user$: Observable<any>;
  date;

  attendanceDoc: AngularFirestoreDocument<any>;
  attendance: Observable<any>;

  constructor(public afs: AngularFirestore,           //injecting firestore service
    public afauth: AngularFireAuth,                   //injecting firebase auth service
    public router: Router, public authService: AuthService,
    private elementRef: ElementRef,
    private datePipe: DatePipe,
  ) {

    this.date = Date.now();
    let latest_date = this.datePipe.transform(this.date, 'yyyy-MM-dd');
    const ref = this.afs.collection('attendance').doc(latest_date);

    this.afauth.authState.subscribe(user => {
      if (user) {
        this.userId = user.uid
        console.log(this.userId);
        //this.ref1 = afs.doc<any>(`users/${this.userId}`).collection('attendance')
      }
    })
  }

  ngOnInit() {

    this.date = Date.now();
    let latest_date = this.datePipe.transform(this.date, 'yyyy-MM-dd');


    this.user$ = this.authService.user$;
    this.elementRef.nativeElement.ownerDocument.body.classList.add('loginBg'); //for background image


  }


  public ngOnDestroy() {
    this.elementRef.nativeElement.ownerDocument.body.classList.remove('loginBg');   //for background image
  }

  punchOutTime() {
    this.date= Date.now();
    let latest_date=this.datePipe.transform(this.date, 'dd-MM-yyyy');

    var attendanceData={
      punchOutTime:moment().format('LTS')
    }

    this.afs.collection('users')
            .doc(this.userId)
            .collection('attendance')
            .doc(latest_date)
            .set(attendanceData)
            .then(function(){
              console.log("Success")
            })
    
    
}

  punchInTime() {
    this.date = Date.now();
    let latest_date1 = this.datePipe.transform(this.date, 'dd-MM-yyyy');

    var attendanceData1={
      PunchInTime: moment().format('LTS')
    }
    this.afs.collection('users')
            .doc(this.userId)
            .collection("attendance")
            .doc(latest_date1)
            .set(attendanceData1)
            .then(function(){
      console.log("Successfully")
    })
    
   
  }

}













/*
   //this.ref1.collection(`attendance/${latest_date}`)
        /*  this.ref3=afs.collection('attendance').doc(latest_date)
         console.log(this.ref3);
         //this.ref3=this.attendanceDoc=this.afs.doc(`attendance/${latest_date}`)

    //this.attendance=this.attendanceDoc.valueChanges();*/

            //const id = this.datePipe.transform(this.date, 'yyyy-MM-dd');
    //const ref = this.afs.collection('attendance').doc(latest_date);
    //console.log(ref);

     /* this.afs.collection('attendance')

    const time2 = {
      punchIn: moment().format('LTS')
    }

    this.ref2.add(time2);
    console.log(time2); 
    
    
    this.ref1.add(time1);
    //this.ref1.doc(Date.now());
    console.log(time1);
     //punchIn:firebase.firestore.FieldValue.serverTimestamp(),

      /* this.ref2 = afs.doc<any>(`attendance/${latest_date}`)
        console.log(this.ref1); */
  



