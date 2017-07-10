import { Injectable } from '@angular/core';
import { Component } from '@angular/core';
import { BotProvider } from '../providers/bot/bot';

@Component({
    providers: [BotProvider]
})

@Injectable()
export class GameService{
	players = [];
	turn: boolean = true;
	gameType: number; /* 0 Bot, 1 MP Local, 2 MP Online*/
	won_fields: any = this.initWon_Fields(); /* false, 1, 2, 3 = feld voll kein sieger*/
	fields: any = this.initField();
	nextfield: any = [0,1,2,3,4,5,6,7,8];
	constructor(public bot: BotProvider){
	}

	initPlayers(){
		
	}

	initField(){
		return [[[0,0,0],[0,0,0],[0,0,0]],[[0,0,0],[0,0,0],[0,0,0]],[[0,0,0],[0,0,0],[0,0,0]],[[0,0,0],[0,0,0],[0,0,0]],[[0,0,0],[0,0,0],[0,0,0]],[[0,0,0],[0,0,0],[0,0,0]],[[0,0,0],[0,0,0],[0,0,0]],[[0,0,0],[0,0,0],[0,0,0]],[[0,0,0],[0,0,0],[0,0,0]]];
	}
	initWon_Fields(){
		return [false, false,false,false,false,false,false,false,false];
	}
	is_Turn(){
		/* TODO */
		return true;
	}
	validField(x){
		for(let entry of this.nextfield){
			if(entry==x) return true
		}
		return false;
	}
	isFieldFull(field: number){
		for(let fieldtmp of this.fields[field]){
			for(let element of fieldtmp)
				if(element == 0) return false;
		}
		return true;
	}
	/* gültige felder für nächsten zug basierend auf aktuellen zug */
	setvalidFields(y,z){
		this.nextfield = [];
		let tetris : any = [[0,1,2],
						  	[3,4,5],
 							[6,7,8]];
		let nextMove = tetris[y][z];
		
		var tmp = true;

		if(this.isFieldFull(nextMove) || this.won_fields[nextMove]){
			/* alle nicht gewonnen felder möglicher nächster zug */
			let i: number = 0;
			for(let isWon of this.won_fields){
				if(!isWon){
					this.nextfield.push(i);
				}
				++i;
			}
		}
		else{
			this.nextfield = [nextMove];
		}	
	}
	isWin(x,y,z){
		let symbol: number = (this.turn)? 1 : 2;
		let field: any = this.fields[x];
		let tmp: any = [0,1,2]

		for(let i of tmp){
			/* horizontal */
			if(field[0][i]==symbol&&field[1][i]==symbol&&field[2][i]==symbol) return true;
			/* vertikal */
			if(field[i][0]==symbol&&field[i][1]==symbol&&field[i][2]==symbol) return true;
			/* kreuz */
			if(field[0][0]==symbol&&field[1][1]==symbol&&field[2][2]==symbol) return true;
			if(field[0][2]==symbol&&field[1][1]==symbol&&field[2][0]==symbol) return true;
		}
		return false;

	}

	PlayerClick(x,y,z){
		this.localMP(x,y,z);
	}

	localMP(x,y,z){
		/* wenn schon belegt | falsches feld | nicht sein spielzug*/
		if(this.fields[x][y][z] != 0 || !this.validField(x)|| !this.is_Turn()) return;
		let symbol: number;
		if(this.turn) symbol = 1;	
		else symbol = 2;	
		this.fields[x][y][z] = symbol;

		if(this.isWin(x,y,z)){
			this.won_fields[x] = symbol;
		}
		let fieldN: number = [[0,1,2],
						  	[3,4,5],
 							[6,7,8]][y][z];
		this.setvalidFields(y,z);
		if(this.isFieldFull(fieldN)){
			this.isWin[fieldN] = 3;
		}
		this.turn = !this.turn;
	}
	gameOver(){
		/* TODO wenn game ganz over*/
		return false;
	}
	playerClick(x,y,z){
		switch(this.gameType) { 
			case 0: { 
				/* Spieler */
				this.PlayerClick(x,y,z);
				/* BOT */
				if(!this.gameOver()){
					let choice: any = this.bot.getChoice();
					this.PlayerClick(choice[0],choice[1],choice[2]);
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



/*return [[
	[1,1,1],
	[2,2,2],
	[0,0,0]],	

	[
	[1,1,1],
	[2,2,2],
	[0,0,0]],

	[
	[1,1,1],
	[2,2,2],
	[0,0,0]],


	//

	[
	[1,1,1],
	[2,2,2],
	[0,0,0]],
	

	[
	[1,1,1],
	[2,2,2],
	[0,0,0]],

	[
	[1,1,1],
	[2,2,2],
	[0,0,0]],


	[
	[1,1,1],
	[2,2,2],
	[0,0,0]],
	

	[
	[1,1,1],
	[2,2,2],
	[0,0,0]],

	[
	[1,1,1],
	[2,2,2],
	[0,0,0]]
	*/