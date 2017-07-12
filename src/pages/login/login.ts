import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';

// import { Observable } from 'rxjs/observable';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { GamestatusProvider } from '../../providers/gamestatus/gamestatus';

import { AuthProvider } from '../../providers/auth/auth';
import * as firebase from 'firebase/app';

// import * as firebase from 'firebase/app';
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
  firstEnterd:boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public auth: AuthProvider, public gameStatus: GamestatusProvider) {
    firebase.auth().onAuthStateChanged(firebaseUser => {
      if (firebaseUser) {
        // wenn anonym dann setze name Guest-{{UID}}        
        this.gameStatus.players[0].name = this.auth.getdisplayName();
        this.clearFirebase();
        this.navCtrl.setRoot(HomePage);
      }
    });
  }

  ionViewDidLoad() { }
  anonAuth():void{
    this.auth.signInAnonym();
  }
  googleAuth():void{
    this.auth.signInGoogle();
  }
  clearFirebase():void{
    //wenn multiplayer und nicht created == z.b. handy neu gestartet lobby löschen
    //damit die trigger funken
    if(!this.firstEnterd){
      this.firstEnterd = true;      
      const query = firebase.database().ref("/games").orderByChild('state_creator_uid').equalTo("1_" + this.auth.getUserUid()).limitToFirst(1);
      query.once('value', snap => {
        if(!snap.val()) return;
        let key: string = Object.keys(snap.val())[0];
        firebase.database().ref("/games").child(key).remove();
      });
    }
  }
}