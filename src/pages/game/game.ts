import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { HomePage } from '../home/home';

import { AuthProvider } from '../../providers/auth/auth';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { GameServiceProvider } from '../../providers/game-service/game-service';
import { GamestatusProvider } from '../../providers/gamestatus/gamestatus';

@IonicPage()

@Component({
  selector: 'page-game',
  templateUrl: 'game.html',
})

export class GamePage {
  index = [[0, 1, 2], [3, 4, 5], [6, 7, 8]]; // feld zeichen hilfe
  index2 = [0, 1, 2];
  chat = [];
  newMessage;
  timeLeft=30;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public gameService: GameServiceProvider,
    public gameStatus: GamestatusProvider,
    public auth: AuthProvider,
    public zone: NgZone,
    public db: FirebaseProvider) {
    gameStatus.resett();
    gameService.gamePage = this;
    if (typeof this.navParams.get('type') != 'undefined') gameStatus.gameType = this.navParams.get('type');
    else gameStatus.gameType = 2;
    if (gameStatus.gameType == 0) gameStatus.players[1].name = "Bot";
    if (gameStatus.gameType == 1) gameStatus.players[1].name = "Guest2";
    if (gameStatus.gameType == 2) this.initChat();
  }

  ionViewWillEnter() {
    this.gameStatus.startTimer(30,()=>{
      if(this.gameStatus.timeLeft==0){
        this.gameStatus.stopTimer();
        if(!this.gameService.isGameOver()){
          let pos:any = this.gameService.getRandomTile();
          this.playerClick(pos[0],pos[1],pos[2]);
        }      
      }
    });
  }

  ionViewWillLeave() {
    if(this.gameStatus.gameType == 2) this.db.stopListenToMessages(this.gameStatus.key);
    this.gameStatus.stopTimer();
  }

  initChat() {
    this.db.newMessages.subscribe((snap) => {
      this.zone.run(() => {// sonst updated die seite nicht immer richtig
        this.chat.push(snap.val());
      });
    }, (err) => {
      alert('initChat: ' + err);
    });
    this.db.startListenToMessages(this.gameStatus.key);
  }

  isPossibleField(v: number): boolean {
    /* wenn alle felder möglich nichts makieren */
    if (this.gameStatus.nextfield.sort().join(',') === [0, 1, 2, 3, 4, 5, 6, 7, 8].sort().join(',')) return false;
    for (let entry of this.gameStatus.nextfield) {
      if (entry == v) return true
    }
    return false;
  }

  getClassValue(v: number): number {
    if (this.isPossibleField(v))   return 0;//"selected noPadding";
    if(this.gameStatus.won_fields[v]==1) return 1;//"player1_won noPadding";
    if(this.gameStatus.won_fields[v]==2) return 2;//"player2_won noPadding";
    return -1;// "noPadding";
  }

  getPlayerTurnClass(): string {
    if (this.gameStatus.turn) return "player1_border"
    return "player2_border";
  }

  ionViewDidLoad(): void { }
  playerClicked(event):void{
    this.gameService.playerClick(event[0],event[1],event[2]);
  }
  playerClick(x, y, z): void {
    this.gameService.playerClick(x, y, z);
  }
  btnRestartGame(): void {
    if (this.gameStatus.gameType == 0 || this.gameStatus.gameType == 1) this.gameStatus.resett();
    //else iwas wegen mit mp online
  }

  btnReturn(): void {
    if (this.gameStatus.gameType == 0 || this.gameStatus.gameType == 1) this.gameStatus.resett();
    //else iwas wegen mit mp online
    this.navCtrl.push(HomePage);
  }
  getScore(symbol): number {
    return this.gameStatus.getScore(symbol);
  }
  sendMessage(event): void {
    let enter: number = 13;
    if (event.keyCode == enter && this.newMessage) {
      let messageInfos: any = { name: this.auth.getdisplayName(), message: this.newMessage };
      let key: string = this.gameStatus.key;
      this.db.pushMessage(key,messageInfos);
      this.zone.run(() => { // sonst wird das input feld nicht immer richtig gecleared
        this.newMessage = "";
      });
    }
  }

}
