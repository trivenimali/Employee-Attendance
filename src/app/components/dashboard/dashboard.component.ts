import { Component, OnInit, ElementRef, PipeTransform, Pipe } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable, of, merge } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { DatePipe } from '@angular/common';
import { Moment } from 'moment';
const moment = require('moment');
import { map } from 'rxjs/operators';
import { User } from 'firebase';

//interface is used for getting data of collection
export interface Attendance{
  //id:string;
  punchIn:string;
  punchOut:string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  attendCol: AngularFirestoreCollection<Attendance>;  //for retrieving data of collection
  attend: Observable<Attendance[]>;                   //for retrieving data of collection 
  punchIn:Date;                                       //used in functionality of punchIn
  punchOut:Date;                                      //used in functionality of punchOut
  date;                                               //used for accessing date
  userId: any;                                        //for id of user
  user$: Observable<any>;                             //used for accessing authService in this
  clicked = false; 
  todayNumber: number = Date.now();    
  attend1:any;   
  time_diff; 
  isPunchInDisable=false;
  isPunchOutDisable= false;               
  
  constructor(public afs: AngularFirestore,           //injecting firestore service
              public afauth: AngularFireAuth,         //injecting firebase auth service
              public router: Router, public authService: AuthService,
              private elementRef: ElementRef,
              private datePipe: DatePipe)
              { }

  ngOnInit() {

      this.user$ = this.authService.user$;

      //this will gives a user id
      this.afauth.authState.subscribe(user => {
          if (user) {
             this.userId = user.uid
             console.log(this.userId);
        }
        
        //displaying punchIn and punchOut time on dashboard

        this.date=Date.now();
        let latest_date=this.datePipe.transform(this.date, 'dd-MM-yyyy')
        console.log(latest_date);

        this.afs.collection('users')
                .doc(this.userId)
                .collection('attendance')
                .doc(latest_date)
                .valueChanges()             //valuechanges gives only data except id of document
                .subscribe(res=>{
                  console.log(res);

                  this.punchIn= res['punchInTime'];
                  this.punchOut= res['punchOutTime'];
                })
      })
}

  public ngOnDestroy() {
    this.elementRef.nativeElement.ownerDocument.body.classList.remove('loginBg');   //for background image
  }

  //for getting punchIn time
  punchInTime() {

    this.isPunchInDisable=true;
   
    this.date = Date.now();
    let latest_date = this.datePipe.transform(this.date, 'dd-MM-yyyy');//it will gives current date

    this.punchIn=new Date(this.date);   //used for getting current time

    //below code is used to set employees punch in time which stores in firestore collection
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
}

  //for getting punchOut time
  punchOutTime() {

    this.isPunchOutDisable=true;
        this.date= Date.now();
        let latest_date=this.datePipe.transform(this.date, 'dd-MM-yyyy'); //it will shows current date
    
        this.punchOut=new Date(this.date);      //used for getting current time
        
        //below code is used to set employees punch out time which stores in firestore collection 
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

                //calculating difference of punchOut and punchIn time
                var punchIn_time=moment(this.punchIn);
                var punchOut_time=moment(this.punchOut)
         
                //used moment function for calculating difference between punchIn time and punchOut time
                this.time_diff=punchOut_time.diff(punchIn_time,'seconds');
         
                console.log(this.time_diff); 

                //storing total hours in firestore collection
                  this.afs.collection('users')
                        .doc(this.userId)
                        .collection('attendance')
                        .doc(latest_date)
                        .set({
                          total_hours:this.time_diff
                        }, {merge:true})
                        .then(function(){
                          console.log("success")
                        }) 
                        
         }
}















 //used for retrieving data from collection
             //it will gives collection data except id of document
/* this.attendCol=this.afs.collection('users').doc(this.userId).collection('attendance');
      this.attend1=this.attendCol.snapshotChanges().pipe(map(actions=>{
          return actions.map(a=>{
            const data=a.payload.doc.data() as Attendance
            const id= a.payload.doc.id;
          
            console.log(data);
           
            return{id, data};   
          })
      }))
       this.attendCol = this.afs.collection('users').doc(this.userId).collection('attendance');
    this.attend1 = this.attendCol.snapshotChanges().pipe(map(actions=>{
      return actions.map(a=>{
        const data=a.payload.doc.data() as Attendance
        const id= a.payload.doc.id;
      
        console.log(data);
       
        return{id, data};   
      })
  })) 
      
  this.attendCol=this.afs.collection('users').doc(this.userId).collection('attendance');
        this.attend1=this.attendCol.snapshotChanges().pipe(map(actions=>{
          return  actions.map(a=>{
            const data=a.payload.doc.data() as Attendance
            const id= a.payload.doc.id;
          
            console.log(data);
           
            return{id, data};   
          })
        }))*/





  



















































































































