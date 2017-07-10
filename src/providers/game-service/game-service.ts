import { Injectable } from '@angular/core';
import { Component } from '@angular/core';
import { BotProvider } from '../bot/bot';
import { GamestatusProvider } from '../gamestatus/gamestatus';

/*
  Generated class for the GameServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
 @Injectable()
export class GameServiceProvider {
	constructor(public bot: BotProvider, public gameStatus: GamestatusProvider){
		this.bot.gameStatus = gameStatus;
	}

	is_Turn(){
		/* TODO */
		return true;
	}
	validField(x){
		for(let entry of this.gameStatus.nextfield){
			if(entry==x) return true
		}
		return false;
	}
	isFieldFull(field: number){
		for(let fieldtmp of this.gameStatus.fields[field]){
			for(let element of fieldtmp)
				if(element == 0) return false;
		}
		return true;
	}
	/* gültige felder für nächsten zug basierend auf aktuellen zug */
	setvalidFields(y,z){
		this.gameStatus.nextfield = [];
		let tetris : any = [[0,1,2],
						  	[3,4,5],
 							[6,7,8]];
		let nextMove = tetris[y][z];
		
		var tmp = true;

		if(this.isFieldFull(nextMove) || this.gameStatus.won_fields[nextMove]){
			/* alle nicht gewonnen felder möglicher nächster zug */
			let i: number = 0;
			for(let isWon of this.gameStatus.won_fields){
				if(!isWon){
					this.gameStatus.nextfield.push(i);
				}
				++i;
			}
		}
		else{
			this.gameStatus.nextfield = [nextMove];
		}	
	}
	isWin(x,y,z){
		let symbol: number = (this.gameStatus.turn)? 1 : 2;
		let field: any = this.gameStatus.fields[x];
		let tmp: any = [0,1,2]

		/* kreuz */	
		if(field[0][0]==symbol&&field[1][1]==symbol&&field[2][2]==symbol) return true;
		if(field[0][2]==symbol&&field[1][1]==symbol&&field[2][0]==symbol) return true;

		for(let i of tmp){
			/* horizontal */
			if(field[0][i]==symbol&&field[1][i]==symbol&&field[2][i]==symbol) return true;
			/* vertikal */
			if(field[i][0]==symbol&&field[i][1]==symbol&&field[i][2]==symbol) return true;
			
		}
		return false;

	}

	PlayerClick(x,y,z){
		return this.localMP(x,y,z);
	}

	localMP(x,y,z){
		/* wenn schon belegt | falsches feld | nicht sein spielzug*/
		if(this.gameStatus.fields[x][y][z] != 0 || !this.validField(x)|| !this.is_Turn()) return false;
		let symbol: number;
		if(this.gameStatus.turn) symbol = 1;	
		else symbol = 2;	
		this.gameStatus.fields[x][y][z] = symbol;

		if(this.isWin(x,y,z)){
			this.gameStatus.won_fields[x] = symbol;
		}
		let fieldN: number = [[0,1,2],
						  	  [3,4,5],
 							  [6,7,8]][y][z];
		this.setvalidFields(y,z);
		if(this.isFieldFull(fieldN)){
			this.isWin[fieldN] = 3;
		}
		this.gameStatus.turn = !this.gameStatus.turn;
		return true;
	}
	gameOver(){
		/* TODO wenn game ganz over*/
		return false;
	}
	playerClick(x,y,z){
		switch(this.gameStatus.gameType) { 
			case 0: { 
				/* Spieler */
				this.PlayerClick(x,y,z);
				/* BOT */
				if(!this.gameOver()){
					let choice: any = this.bot.getChoice();
					if(choice){
						if(!this.PlayerClick(choice[0],choice[1],choice[2])) console.log("Fehlerhaftes Tile ausgewählt!" + choice);
					}
					else console.log("Bot-Choice-Error");
				}
				break; 
			}
			case 1: {
				this.localMP(x,y,z);
				break;
			}
			case 2: {
				//statements;
				break;
			}
		} 
	}
}








