import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { PlayerProvider } from '../player/player';
import 'rxjs/add/operator/map';

/*
  Generated class for the GamestatusProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class GamestatusProvider {
	players: PlayerProvider[] = [new PlayerProvider, new PlayerProvider]; // players[0] = local players[1] = wenn multiplayer spieler
	turn: boolean = true;
	gameType: number; /* 0 Bot, 1 MP Local, 2 MP Online*/
	won_fields: any = this.initWon_Fields(); /* false, 1, 2, 3 = feld voll kein sieger*/
	fields: any = this.initField();
	nextfield: any = [0,1,2,3,4,5,6,7,8];
  constructor(public player:PlayerProvider) {}
  	initField(){
		return [[[0,0,0],[0,0,0],[0,0,0]],[[0,0,0],[0,0,0],[0,0,0]],[[0,0,0],[0,0,0],[0,0,0]],[[0,0,0],[0,0,0],[0,0,0]],[[0,0,0],[0,0,0],[0,0,0]],[[0,0,0],[0,0,0],[0,0,0]],[[0,0,0],[0,0,0],[0,0,0]],[[0,0,0],[0,0,0],[0,0,0]],[[0,0,0],[0,0,0],[0,0,0]]];
	}
	initWon_Fields(){
		return [false, false,false,false,false,false,false,false,false];
	}

}
