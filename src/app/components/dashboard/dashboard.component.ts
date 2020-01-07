import { Component, OnInit, ElementRef } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { DatePipe } from '@angular/common';
const moment = require('moment');
import { getDistance } from 'geolib';
import { distanceTo } from 'geolocation-utils';
const geolib = require('geolib');

//interface is used for getting data of collection
export interface Attendance {
  //id:string;
  punchIn: string;
  punchOut: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  attendCol: AngularFirestoreCollection<Attendance>;    //for retrieving data of collection
  attend: Observable<Attendance[]>;                     //for retrieving data of collection 
  punchIn_Time: Date;                                   //used in functionality of punchIn
  punchOut_Time: Date;                                  //used in functionality of punchOut
  date;                                                 //used for accessing date
  userId: any;                                          //for id of user
  user$: Observable<any>;                               //used for accessing authService in this
  clicked = false;
  todayNumber: number = Date.now();
  attend1: any;
  time_diff;
  distance: any;
  user_lat; user_lon;

  constructor(public afs: AngularFirestore,             //injecting firestore service
    public afauth: AngularFireAuth,                     //injecting firebase auth service
    public router: Router, public authService: AuthService,
    private elementRef: ElementRef,
    private datePipe: DatePipe) { }

  ngOnInit() {

    this.user$ = this.authService.user$;
    this.elementRef.nativeElement.ownerDocument.body.classList.add('loginBg');

    //this will gives a user id
    this.afauth.authState.subscribe(user => {
      if (user) {
        this.userId = user.uid
        console.log(this.userId);
      }

      this.date = Date.now();
      let latest_date = this.datePipe.transform(this.date, 'dd-MM-yyyy')
      console.log(latest_date);

      //displaying punchIn and punchOut time on dashboard
      this.afs.collection('users')
        .doc(this.userId)
        .collection('attendance')
        .doc(latest_date)
        .snapshotChanges()             //valuechanges gives only data except id of document
        .subscribe((res: any) => {
          console.log(res.payload.data());
          this.punchIn_Time = res.payload.data().punchInTime;
          this.punchOut_Time = res.payload.data().punchOutTime;
        })
    })

    //displays latitude and logitude
    this.authService.getLocation().then(pos => {

      console.log(`Position: longitude:${pos.lng} latitude:${pos.lat}`);

      this.distance = distanceTo(
        { lat: 18.5446292, lon: 73.9067578 },
        //{ lat: 18.4967, lon: 73.9417 },//lat-lon of magarpatta
        { lat: pos.lat, lon: pos.lng }
      )
      console.log(this.distance)
      console.log(geolib.convertDistance(this.distance,'km'))

      this.user_lat = pos.lat
      this.user_lon = pos.lng

      this.distance = getDistance(
        { lat: 18.5446292, lon: 73.9067578 },
        { lat: 18.4967, lon: 73.9417 }
      );

      console.log(this.distance)

      console.log(geolib.convertDistance(this.distance, 'km'));

      navigator.geolocation.getCurrentPosition(
        function () {
          console.log(
            'You are',
            geolib.getDistance(
              { lat: 18.5446292, lon: 73.9067578 },
              { lat: 18.4967, lon: 73.9417 },
              { lat: 18.5446292, lon: 73.9067578 }
            ),
            'meters away from webcubator Technology '
          );
        },
        () => {
          alert('Position could not be determined')
        }
      )

    });

    //for checking locations points are near or not
    //var web = { lat: 18.5446292, lon: 73.9067578 }
    //var user_loc = { lat: 18.4967, lon:  73.9417 }

    // var n = this.find_dist(web, user_loc, 100)

    //console.log(n);
  }

  public ngOnDestroy() {
    this.elementRef.nativeElement.ownerDocument.body.classList.remove('loginBg');   //for background image
  }

  //for getting punchIn time
  punchInTime() {

    this.date = Date.now();
    let latest_date = this.datePipe.transform(this.date, 'dd-MM-yyyy');//it will gives current date

    this.punchIn_Time = new Date(this.date);   //used for getting current time

    //below code is used to set employees punch in time which stores in firestore collection
    this.afs.collection('users')
      .doc(this.userId)
      .collection("attendance")
      .doc(latest_date)
      .set({
        punchInTime: this.date
      })
      .then(function () {
        console.log("Success")
      })
  }
  //for getting punchOut time
  punchOutTime() {

    this.date = Date.now();
    let latest_date = this.datePipe.transform(this.date, 'dd-MM-yyyy'); //it will shows current date

    this.punchOut_Time = new Date(this.date);      //used for getting current time

    //below code is used to set employees punch out time which stores in firestore collection 
    this.afs.collection('users')
      .doc(this.userId)
      .collection('attendance')
      .doc(latest_date)
      .update({
        punchOutTime: this.date
      })
      .then(function () {
        console.log("Success")
      })

    //calculating difference of punchOut and punchIn time
    var punchIn_time = moment(this.punchIn_Time);
    var punchOut_time = moment(this.punchOut_Time);

    //used moment function for calculating difference between punchIn time and punchOut time
    this.time_diff = punchOut_time.diff(punchIn_time, 'hours');

    console.log(this.time_diff);

    //storing total hours in firestore collection
    this.afs.collection('users')
      .doc(this.userId)
      .collection('attendance')
      .doc(latest_date)
      .set({
        total_hours: this.time_diff
      }, { merge: true })
      .then(function () {
        console.log("success")
      })
  }
  /* 
  for checking two location points are near or not

    find_dist(checkPoint, centerPoint, km) {
  
      var ky = 40000 / 360;
      var kx = Math.cos(Math.PI * centerPoint.lat / 180.0) * ky;
      var dx = Math.abs(centerPoint.lng - checkPoint.lng) * kx;
      var dy = Math.abs(centerPoint.lat - checkPoint.lat) * ky;
      return Math.sqrt(dx * dx + dy * dy) <= km;
    } */


}
