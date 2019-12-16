import { Component, OnInit, ElementRef, PipeTransform, Pipe } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import * as firebase from 'firebase';
import { Attendance } from 'src/app/interface/attendance';
import { User } from '../../interface/user';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  todayNumber: number = Date.now();
  todayNumber1:Date;
  todayNumber2:Date;
  userId: any;
  user$: Observable<any>;
  //user:Observable<User>;
  date;
  ref1;

  clicked = false;

 /*  attendanceCollection:AngularFirestoreCollection<any>;
   */


  constructor(public afs: AngularFirestore,           //injecting firestore service
    public afauth: AngularFireAuth,                   //injecting firebase auth service
    public router: Router, public authService: AuthService,
    private elementRef: ElementRef,
    private datePipe: DatePipe,
  ) {

    this.date = Date.now();
    let latest_date = this.datePipe.transform(this.date, 'yyyy-MM-dd');
    
    this.afauth.authState.subscribe(user => {
      if (user) {
        this.userId = user.uid
        console.log(this.userId);
        this.ref1 = afs.doc<any>(`users/${this.userId}`).collection('attendance')
      }
    })
  }

  ngOnInit() {

    this.user$ = this.authService.user$;
    this.elementRef.nativeElement.ownerDocument.body.classList.add('loginBg'); //for background image
    
    var attend=this.afs
                  .collection('attendance')
                  .get()
                  .subscribe(function(querySnapshot){
                    querySnapshot.forEach(function(doc){
                      console.log(doc.id , "=>", doc.data());
                    });
                  }) 

    //console.log(attend);
   
  }

  public ngOnDestroy() {
    this.elementRef.nativeElement.ownerDocument.body.classList.remove('loginBg');   //for background image
  }

   punchOutTime() {
    this.date= Date.now();
    let latest_date=this.datePipe.transform(this.date, 'dd-MM-yyyy');

    let date1= new Date(this.date);
    console.log(date1)

    this.todayNumber2=new Date(this.date);
    const attendanceData={
      punchOutTime:moment().format('LTS')
    }

    this.afs.collection('users')
            .doc(this.userId)
            .collection('attendance')
            .doc(latest_date)
            .update({
              punchOutTime:this.date
            })
            .then(function(){
              console.log("Success")
            })
  }

   punchInTime() {
    this.date = Date.now();
    let latest_date = this.datePipe.transform(this.date, 'dd-MM-yyyy');

    this.todayNumber1=new Date(this.date);

    const attendanceData1={
      PunchInTime: moment().format('LTS')
    }
      this.afs.collection('users')
            .doc(this.userId)
            .collection("attendance")
            .doc(latest_date)
            .set({
              punchInTime: this.date
            })
            .then(function(){
      console.log("Success")
    })

    //user.isDisabled = !user.isDisabled; 
  }

  isDisabled(user) : boolean {
    return user && user.username === name;
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
  



