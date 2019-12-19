import { Component, OnInit, ElementRef} from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { DatePipe } from '@angular/common';
import { Moment } from 'moment';
import { map } from 'rxjs/operators';
const moment = require('moment');

export interface Attendance{
  //id:string;
  punchIn:string;
  punchOut:string;
}

interface docId extends Attendance { 
  id: string; 
}

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

  time_diff;

  attendCol: AngularFirestoreCollection<Attendance>;                //for retrieving data of collection
  attend: Observable<Attendance[]>;  
  //attend1:Observable<any>;                               //for retrieving data of collection
  user$: Observable<any>;                                           //used for accessing authService in this
  userId: any; 
  difference:any; 
  punchIn;
  punchOut; 
  attend1:any;                                                   //for id of user
  
    constructor(public authService: AuthService,                    //authentication Service
                public elementRef: ElementRef,                      
                public afs: AngularFirestore,                       //accessing data of firestore 
                public datePipe: DatePipe,                          //used for formatting date and time
                public afauth: AngularFireAuth ) { }                //injecting firebase auth service

  
    ngOnInit() {

      this.user$ = this.authService.user$;
      this.elementRef.nativeElement.ownerDocument.body.classList.add('loginBg'); //for background image

      //for getting user id
      this.afauth.authState.subscribe(user => {
      if (user) {
        this.userId = user.uid
        console.log(this.userId);

      //used for retrieving data from collection
      this.attendCol = this.afs.collection('users').doc(this.userId).collection('attendance');
      //this.attend = this.attendCol.valueChanges();         //valueChange gives all collection data except id of document
      

      //snapshotChange gives metadata
      this.attend1=this.attendCol.snapshotChanges().pipe(map(actions =>{
        return actions.map(a=>{
          const data=a.payload.doc.data() as Attendance
          const id= a.payload.doc.id;
          var punch_in=moment(a.payload.doc.data().punchIn);
          var punch_out=moment(a.payload.doc.data().punchOut);
          console.log(punch_in);
          console.log(punch_out);

          this.time_diff=punch_out.diff(punch_in);
          console.log(this.time_diff)
          return{id, data};
         
        })
      }))
      

     

         
      }
    })

   
  }

  
  
}