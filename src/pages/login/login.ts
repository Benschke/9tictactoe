import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';

import { Observable } from 'rxjs/observable';
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

  constructor(public navCtrl: NavController, public navParams: NavParams, public auth: AuthProvider, public gameStatus: GamestatusProvider) {
    firebase.auth().onAuthStateChanged(firebaseUser => {
      if(firebaseUser){
        // wenn anonym dann setze name Guest-{{UID}}        
        this.gameStatus.players[0].name  = this.auth.getdisplayName();
        this.navCtrl.setRoot(HomePage);        
      } 
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }
  anonAuth(){
    this.auth.signInAnonym();    
  }
  googleAuth(){
    this.auth.signInGoogle();  
  }
}


