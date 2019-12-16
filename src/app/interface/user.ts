export interface User {
    uid:string;
    name:string;
    email:string;
    phoneNo:string;
    isDisabled:boolean;
   
}
/*  //this.ref1 = firebase.firestore().collection('users').doc(uid).collection('attendance'); */