import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GooglePlus } from '@ionic-native/google-plus';
import { HomePage } from '../home/home';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireModule } from 'angularfire2';

import * as firebase from 'firebase/app';

import { GamestatusProvider } from '../../providers/gamestatus/gamestatus';

/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public googleplus: GooglePlus, public gameStatus: GamestatusProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }
  googleauth(){
  	this.googleplus.login({
      'webClientId' : '495290538261-97tkujbj8pq8slcs0j8ptp5e9692a0l1.apps.googleusercontent.com',
      'offline' : true
    })
  	.then((res)=>{
  		const firecreds = firebase.auth.GoogleAuthProvider.credential(res.idToken);
        firebase.auth().signInWithCredential(firecreds).then((success)=>{
           if(firebase.auth().currentUser.displayName){
             this.gameStatus.players[0].name = firebase.auth().currentUser.displayName;
           } 
          // else alert("Cant Read Name");
          this.navCtrl.setRoot(HomePage);
        }).catch((err)=>{
          alert('Firebase auth failed ' + err);
      })  		
  	}).catch((err)=>{
  		alert('Error:' + err);
  	})
  }
}


