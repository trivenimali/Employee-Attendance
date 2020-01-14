import { Component, OnInit, ElementRef } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { DatePipe } from '@angular/common';
const moment = require('moment');
import { getDistance } from 'geolib';
import { distanceTo, insideCircle } from 'geolocation-utils';
const geolib = require('geolib');
import {
  toLatLon, toLatitudeLongitude, headingDistanceTo, moveTo, insidePolygon
} from 'geolocation-utils';
import { ToastrService } from 'ngx-toastr';

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
  distance: any;                                        //used for calculate distance between two location
  user_lat;                                             // latitude of user location
  user_lon;
  check_status: boolean;                                        //longitude of user location

  constructor(public afs: AngularFirestore,             //injecting firestore service
    public afauth: AngularFireAuth,                     //injecting firebase auth service
    public router: Router,                              //for routing purpose
    public authService: AuthService,                    //calling authservice for use
    private elementRef: ElementRef,
    private datePipe: DatePipe,
    public toastr: ToastrService) { }

  ngOnInit() {

    this.user$ = this.authService.user$;
    this.elementRef.nativeElement.ownerDocument.body.classList.add('loginBg');
    const radius = 1000;                                  //radius in meters

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
      console.log(geolib.convertDistance(this.distance, 'km'))

      this.user_lat = pos.lat
      this.user_lon = pos.lng

      //below method shows user status if user is in desired radius or not 
      this.check_status = insideCircle({ lat: this.user_lat, lon: this.user_lon }, { lat: 18.5446292, lon: 73.9067578 }, radius);
      console.log(this.check_status);
      if (this.check_status === false) {
        this.toastr.info('You are not allow Punch-In');

      }

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

  }

  public ngOnDestroy(){
    this.elementRef.nativeElement.ownerDocument.body.classList.remove('loginBg');
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
        console.log("success")
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
    var punchOut_time= moment(this.punchOut_Time);

    //used moment.js function for calculating difference between punchIn time and punchOut time
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
}


//used firestore function: set, merge, update
