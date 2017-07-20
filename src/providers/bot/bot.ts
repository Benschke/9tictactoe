import { Injectable } from '@angular/core';
// import { Component } from '@angular/core';
import { GamestatusProvider } from '../gamestatus/gamestatus';
/*
  Generated class for the BotProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/

@Injectable()
export class BotProvider {
	public gameStatus: GamestatusProvider; /* damit game-service und der bot das selbe feld benutzen */
	constructor() { }

	copyArray(ar):any{
		return ar.slice(0);
	}

	isWin(fieldNumber, symbol):any {
		// wenn direkter spielzug == win
		// symbol 1 spieler 2 bot
		let tmp: any = [0, 1, 2]
		let field: any = this.gameStatus.fields[fieldNumber];

		/* kreuz */
		if (field[0][0] == 0 && field[1][1] == symbol && field[2][2] == symbol) return [fieldNumber, 0, 0];
		if (field[0][0] == symbol && field[1][1] == 0 && field[2][2] == symbol) return [fieldNumber, 1, 1];
		if (field[0][0] == symbol && field[1][1] == symbol && field[2][2] == 0) return [fieldNumber, 2, 2];

		if (field[0][2] == 0 && field[1][1] == symbol && field[2][0] == symbol) return [fieldNumber, 0, 2];
		if (field[0][2] == symbol && field[1][1] == 0 && field[2][0] == symbol) return [fieldNumber, 1, 1];
		if (field[0][2] == symbol && field[1][1] == symbol && field[2][0] == 0) return [fieldNumber, 2, 0];

		for (let i of tmp) {
			/* horizontal */
			if (field[0][i] == symbol && field[1][i] == symbol && field[2][i] == 0) return [fieldNumber, 2, i];
			if (field[0][i] == symbol && field[1][i] == 0 && field[2][i] == symbol) return [fieldNumber, 1, i];
			if (field[0][i] == 0 && field[1][i] == symbol && field[2][i] == symbol) return [fieldNumber, 0, i];
			/* vertikal */
			if (field[i][0] == 0 && field[i][1] == symbol && field[i][2] == symbol) return [fieldNumber, i, 0];
			if (field[i][0] == symbol && field[i][1] == 0 && field[i][2] == symbol) return [fieldNumber, i, 1];
			if (field[i][0] == symbol && field[i][1] == symbol && field[i][2] == 0) return [fieldNumber, i, 2];
		}
		return false;

	}

	nextRoundnoWin(possibleChoices):any{
		let tetris: any = [[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8]];
		for (let fieldNumber of possibleChoices) {
			let x: number = 0;
			for (let fieldRow of this.gameStatus.fields[fieldNumber]) {
				let y: number = 0;
				for (let tile of fieldRow) {
					/* feld wo im nächsten zug kein win möglich ist*/
					if (tile == 0 && !this.isWin(tetris[x][y], 1)) return [fieldNumber, x, y];
					++y;
				}
				++x;
			}

		}

	}

	randomTile(possibleChoices):any{
		/* todo wenn kein zug mehr möglich iwas checken solange so */
		if (!possibleChoices || possibleChoices.length < 0) return null;
		let randomField: number = possibleChoices[Math.floor(Math.random() * possibleChoices.length)];
		let x: number = 0;
		for (let row of this.gameStatus.fields[randomField]) {
			let y: number = 0;
			for (let tile of row) {
				if (tile == 0) return [randomField, x, y];
				++y;
			}
			++x;
		}
	}

	getChoice():any{
		/* wenn möglich zu gewinnen gewinn das feld */
		let possibleChoices: any = this.copyArray(this.gameStatus.nextfield);
		/* ein feld gewinnbar? */
		for (let fieldNumber of possibleChoices) {
			var tmp: any = this.isWin(fieldNumber, 2);
			if (tmp) return tmp;
		}
		
		/* win gegner abwehren */
		for(let fieldNumber of possibleChoices){
			var tmp2: any = this.isWin(fieldNumber, 1); // 1 spieler 2 bot
			if(tmp2) return tmp2;
		}

		/* nächsterZug kein Punkt für Gegner */
		let tmp3: any = this.nextRoundnoWin(possibleChoices);
		if (tmp3) return tmp3;

		/* random */
		return (this.randomTile(possibleChoices));
	}

}


