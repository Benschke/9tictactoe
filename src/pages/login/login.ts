import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';

import { GamestatusProvider } from '../../providers/gamestatus/gamestatus';

import { AuthProvider } from '../../providers/auth/auth';
import { FirebaseProvider } from '../../providers/firebase/firebase';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  firstEnterd:boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public auth: AuthProvider, public gameStatus: GamestatusProvider, public db: FirebaseProvider) {
    db.loggedIn.subscribe((firebaseUser)=>{
      if(firebaseUser){
        // wenn anonym dann setze name Guest-{{UID}}        
        this.gameStatus.players[0].name = this.auth.getdisplayName();
        this.clearFirebase();
        this.navCtrl.setRoot(HomePage);
      }
    });
    this.db.listenToLogginStatus();
  }

  ionViewDidLoad() { }
  anonAuth():void{
    this.auth.signInAnonym();
  }
  googleAuth():void{
    this.auth.signInGoogle();
  }
  clearFirebase():void{
    //wenn multiplayer lobby erstellt wurde, dass handy neugestartet wurde (lobby ist noch in firebase vorhanden) und die trigger wieder funken wird die alte lobby gelöscht
    //damit die trigger funken
    if(!this.firstEnterd){
      this.firstEnterd = true;      
      this.db.deleteOldLobby();
    }
  }
}