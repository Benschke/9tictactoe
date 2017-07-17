import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Component, NgZone } from '@angular/core';
import { GamePage } from '../game/game';
import { GamestatusProvider } from '../../providers/gamestatus/gamestatus';
import { AuthProvider } from '../../providers/auth/auth';
import { FirebaseProvider } from '../../providers/firebase/firebase';

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
  lobbys = [];
  gameType;
  constructor(public navCtrl: NavController, public navParams: NavParams, public db: FirebaseProvider, public auth: AuthProvider, public gameStatus: GamestatusProvider, public zone: NgZone) {
    this.gameType = this.navParams.get('type');
  }
  ionViewDidLoad() { }

  ionViewWillEnter() {
    this.db.listenToOpenLobbys();
    this.db.openLobbys.subscribe((snap) => {
      this.zone.run(() => {
        this.lobbys.push({ key: snap.getKey(), name: snap.val().creator_displayName });
      });
    }, (err) => {
      alert("Lobby - ionViewWillEnter(): " + err);
    });
  }
  ionViewWillLeave() {
    this.db.stopListenToOpenLobbys();
  }

  enterGame(playerturn, key): void {
    /* playerturn  true == (Lobby)ersteller, joiner == false */
    let setupInfos: any = (playerturn) ? { // nur ersteller init die lobby in firebase
      turn: true,
      won_fields: this.gameStatus.won_fields,
      fields: this.gameStatus.fields,
      nextField: this.gameStatus.nextfield
    } : false;
    this.db.setUpLobby(key, setupInfos)
      .then((snap: any) => {
        this.gameStatus.initMultiplayer(key);
        this.gameStatus.gameType = 2;
        this.gameStatus.players[0].name = snap.val().creator_displayName;
        this.gameStatus.players[1].name = snap.val().joiner_displayName;
        this.gameStatus.symbol = playerturn;
        this.navCtrl.push(GamePage);
      })
      .catch((err) => {
        alert("Lobby enterGame: " + err);
      })

  }

  createLobby(): void {
    const lobbyInfos = {
      creator_uid: this.auth.getUserUid(),
      creator_displayName: this.auth.getdisplayName(),
      state: 1, // open
      state_creator_uid: "1_" + this.auth.getUserUid() //für uniqueLobby || quelle: https://www.youtube.com/watch?v=sKFLI5FOOHs&feature=youtu.be})
    };
    this.db.createLobby(lobbyInfos).then((key) => { 
      this.db.joinedLobby.subscribe((snap) => {
        if (snap) this.enterGame(true, key); // wird aufgerufen wenn jemand der lobby beitritt 
      },
        (err) => {
          console.log("createLobby: " + err);
        });
      this.db.waitLobby(key); // listener starten ^ 
    });
  }

  createGame(): void {
    this.db.isUniqueLobby().then(snap=>{
      this.createLobby();
    }).catch(err=>{
      alert("Just one Lobby per Person");
    });
  }

  joinGame(key): void {
    this.db.joinLobby(key)
    .then(()=>this.enterGame(false, key))
    .catch((err)=>alert(err));
  }

}
