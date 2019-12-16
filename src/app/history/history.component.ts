import { Component, OnInit, ElementRef, PipeTransform, Pipe } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { firestore } from 'firebase';


@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

  user$: Observable<any>;
  date;
  todayNumber: number = Date.now();
  todayNumber1: Date;
  todayNumber2: Date;
  userId: any;
  ref1: any
  punchInTime: any;

  constructor(public authService: AuthService,
    public elementRef: ElementRef,
    public afs: AngularFirestore,
    public datePipe: DatePipe,
    public afauth: AngularFireAuth,                   //injecting firebase auth service
    public router: Router, ) { }

  ngOnInit() {
    this.date = Date.now();
    let latest_date = this.datePipe.transform(this.date, 'yyyy-MM-dd');

    this.user$ = this.authService.user$;
    this.elementRef.nativeElement.ownerDocument.body.classList.add('loginBg'); //for background image
    this.afauth.authState.subscribe(user => {
      if (user) {
        this.userId = user.uid
        console.log(this.userId);
        //this.ref1 = this.afs.collection('users').doc(this.userId).collection('attendance').doc(latest_date);
      }
    })


    this.date = Date.now();
    latest_date = this.datePipe.transform(this.date, 'dd-MM-yyyy');

    let date1 = new Date(this.date);
    console.log(date1)
    this.afs.collection('attendance')

    this.todayNumber1 = new Date(this.date);

    /*  var attendRef= this.afs.collection('users', ref=>ref.where("userId", '==', this.userId)) .get()
     .subscribe(function(querySnapshot){
       querySnapshot.forEach(function(doc){
         console.log(doc.id, "=>", doc.data());
       });
     }) */

    /* var query=attendRef.collection('attendance', ref=>ref
                       .where('punchInTime', '==', this.punchInTime))
                       .get()
                       .subscribe(function(querySnapshot){
                         querySnapshot.forEach(function(doc){
                           console.log(doc.id, "=>", doc.data());
                         });
                       }) */
   /*  this.afs.collection("users")
      .doc(this.userId)
      .ref
      .get().then(function (doc) {
        if (doc.exists) {
          console.log("Document data:", doc.data());
        } else {
          console.log("No such document!");
        }
      }).catch(function (error) {
        console.log("Error getting document:", error);
      }); */

     

  }

}


