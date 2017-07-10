import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { HomePage } from '../../pages/home/home';

// import { Component } from '@angular/core';
//import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GooglePlus } from '@ionic-native/google-plus';

// import { AngularFireAuth } from 'angularfire2/auth';
//import { AngularFireModule } from 'angularfire2';

import * as firebase from 'firebase/app';
import { GamestatusProvider } from '../../providers/gamestatus/gamestatus';
/*
  Generated class for the AuthProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class AuthProvider {
  constructor(public googleplus: GooglePlus, public gameStatus: GamestatusProvider) {}
  signInAnonym(){
    firebase.auth().signInAnonymously();        
  }
  signInGoogle(){
  	this.googleplus.login({
      'webClientId' : '495290538261-97tkujbj8pq8slcs0j8ptp5e9692a0l1.apps.googleusercontent.com',
      'offline' : true
    })
  	.then((res)=>{
  		const firecreds = firebase.auth.GoogleAuthProvider.credential(res.idToken);
        firebase.auth().signInWithCredential(firecreds).then((success)=>{          
          return true;
        }).catch((err)=>{
          alert('Firebase auth failed ' + err);
      })  		
  	}).catch((err)=>{
  		alert('Error:' + err);
      return false;
  	});  	
  }

  signOut(){
    firebase.auth().signOut();
  }

  getcurrentUser(){
  	return firebase.auth().currentUser;
  }
  getdisplayName(){
    return (firebase.auth().currentUser.isAnonymous) ? "Guest-"+firebase.auth().currentUser.uid : firebase.auth().currentUser.displayName;
  }

}
          