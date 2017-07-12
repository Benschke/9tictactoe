import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Component } from '@angular/core';
// import { Observable } from 'rxjs/Observable';
import { GamePage } from '../game/game';
import { GamestatusProvider } from '../../providers/gamestatus/gamestatus';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import * as firebase from 'firebase/app';

import { AuthProvider } from '../../providers/auth/auth';

/**
 * Generated class for the LobbyPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-lobby',
  templateUrl: 'lobby.html',
})
export class LobbyPage {
  created: boolean = false;
  items: FirebaseListObservable<any[]>;
  fireDB = firebase.database();
  ref = firebase.database().ref("/games");
  gameType;
  lobby;
  constructor(public navCtrl: NavController, public navParams: NavParams, public db: AngularFireDatabase, public auth: AuthProvider, public gameStatus: GamestatusProvider) {
    this.gameType = this.navParams.get('type');
    this.items = db.list('/games', {
      query: {
        orderByChild: 'state',
        equalTo: 1
      }
    });
  }
  ionViewDidLoad() {}

  enterGame(playerturn, key) {
    const query = this.ref.child(key);
    query.once('value', snap => {
      this.gameStatus.initMultiplayer(key);
      this.gameStatus.gameType = 2;
      this.gameStatus.players[0].name = snap.val().creator_displayName;
      this.gameStatus.players[1].name = snap.val().joiner_displayName;
      this.gameStatus.symbol = playerturn;
      if (playerturn) {
        query.update({
          turn: true,
          won_fields: this.gameStatus.won_fields,
          fields: this.gameStatus.fields,
          nextField: this.gameStatus.nextfield
        });
        this.navCtrl.push(GamePage);
      } else this.navCtrl.push(GamePage);
    });
    /* playerturn  true == ersteller, joiner == false */
  }

  createLobby() {
    let currentGame: any = {
      creator_uid: this.auth.getUserUid(),
      creator_displayName: this.auth.getdisplayName(),
      // joiner: null,
      state: 1, // open
      state_creator_uid: "1_" + this.auth.getUserUid() //für uniqueLobby || quelle: https://www.youtube.com/watch?v=sKFLI5FOOHs&feature=youtu.be
    };
    this.ref.push().set(currentGame);

    // id bekommen ^
    const query = this.ref.orderByChild('state_creator_uid').equalTo("1_" + this.auth.getUserUid()).limitToFirst(1);
    query.once('value', snap => {
      let key: string = Object.keys(snap.val())[0];
      const query2 = this.ref.child(key);
      query2.on('value', snap2 => {
        if (snap2.val().nextField) return; // dann wurde das spiel schon init 
        if (snap2.val().state == 2) this.enterGame(true, key);
      });

    });

  }

  createGame() {
    const query0 = this.ref.orderByChild('state_creator_uid').equalTo("1_" + this.auth.getUserUid()).limitToFirst(1);
    query0.once('value', snap => {
      if (!snap.val()) this.createLobby();
      else alert("Just one Lobby per Person");
    });
  }

  joinGame(key) {
    let gameRef: any = this.ref.child(key);
    gameRef.once('value', snap => {
      if (snap.val().creator_uid != this.auth.getUserUid()) {
        gameRef.update({
          joiner_uid: this.auth.getUserUid(),
          joiner_displayName: this.auth.getdisplayName(),
          state: 2
        });
        this.enterGame(false, key);
      } else alert("Cant join own Lobby!");
    });
  }

}
