import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GameServiceProvider } from '../../providers/game-service/game-service';
import { GamestatusProvider } from '../../providers/gamestatus/gamestatus';
import { HomePage } from '../home/home';

@IonicPage()
@Component({
  selector: 'page-game',
  templateUrl: 'game.html'
})

export class GamePage {
	index = [[0,1,2],[3,4,5],[6,7,8]]; // feld zeichen hilfe
	index2= [0,1,2];
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public gameService: GameServiceProvider, 
              public gameStatus: GamestatusProvider) {
    gameStatus.resett();
    gameService.gamePage=this;
     if(typeof this.navParams.get('type') != 'undefined') gameStatus.gameType = this.navParams.get('type');
     else gameStatus.gameType = 2;
     if(gameStatus.gameType==1) gameStatus.players[1].name = "Guest2";
  }

  isPossibleField(v: number):boolean{
    /* wenn alle felder möglich nichts makieren */
    if(this.gameStatus.nextfield.sort().join(',') === [0,1,2,3,4,5,6,7,8].sort().join(',')) return false;
    for(let entry of this.gameStatus.nextfield){
      if(entry==v) return true
    }
    return false;
  }

  getClassValue(v: number):string{
    if(this.isPossibleField(v)) return "selected";
    if(v%2==0) return "bordern";
    return "bordernplus1";    
  }
  
  getPlayerTurnClass():string{
    if(this.gameStatus.turn) return "player1_border"
    return "player2_border";  
  }

  ionViewDidLoad():void{}
  playerClick(x,y,z):void{
    this.gameService.playerClick(x,y,z);
  }
  btnRestartGame():void{
    if(this.gameStatus.gameType == 0 || this.gameStatus.gameType == 1) this.gameStatus.resett();
    //else iwas wegen mit mp online
  }
  
  btnReturn():void{
    if(this.gameStatus.gameType == 0 || this.gameStatus.gameType == 1) this.gameStatus.resett();
    //else iwas wegen mit mp online
    this.navCtrl.push(HomePage);
  }

}
