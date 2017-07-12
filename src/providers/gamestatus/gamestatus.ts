import { Injectable } from '@angular/core';
// import { Http } from '@angular/http';
import { PlayerProvider } from '../player/player';
import 'rxjs/add/operator/map';
import * as firebase from 'firebase/app';
/*
  Generated class for the GamestatusProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class GamestatusProvider {
	players: PlayerProvider[] = [new PlayerProvider, new PlayerProvider]; // players[0] = local players[1] = wenn multiplayer spieler
	turn: boolean = true;
	symbol: boolean; /* hilfs Var für MP */
	key: string; /* hilfsVar für MP /Firebase*/
	gameType: number; /* 0 Bot, 1 MP Local, 2 MP Online*/
	won_fields: any = this.initWon_Fields(); /* false, 1, 2, 3 = feld voll kein sieger*/
	fields: any = this.initField();
	nextfield: any = [0, 1, 2, 3, 4, 5, 6, 7, 8];
	constructor(public player: PlayerProvider) { }
	resett() {
		this.won_fields = this.initWon_Fields();
		this.fields = this.initField();
		this.nextfield = [0, 1, 2, 3, 4, 5, 6, 7, 8];
	}
	updateTurn(turn) {
		if (typeof (turn) != "undefined" && this.turn != turn) this.turn = turn; // sonst ist turn immer true weil if(false) direkt returnen würde
	}
	updatewon_Fields(wFs) {
		if (!wFs) return;
		let iAr: any = [0, 1, 2, 3, 4, 5, 6, 7, 8];
		for (let i of iAr) {
			if (wFs[i] != this.won_fields[i]) this.won_fields[i] = wFs[i];
		}
	}
	updateFields(fields) {
		if (!fields) return;
		let xAr: any = [0, 1, 2, 3, 4, 5, 6, 7, 8];
		let yzAr: any = [0, 1, 2];
		for (let x of xAr) {
			for (let y of yzAr) {
				for (let z of yzAr) {
					if (fields[x][y][z] != this.fields[x][y][z]) this.fields[x][y][z] = fields[x][y][z];
				}
			}
		}
	}
	updateNextField(nf) {
		if (!nf) return;
		let iAr: any = [0, 1, 2, 3, 4, 5, 6, 7, 8];
		for (let i of iAr) {
			if (this.nextfield[i] != nf[i]) this.nextfield[i] = nf[i];
		}
	}
	initMultiplayer(key) {
		this.key = key;
		this.resett();
		const query = firebase.database().ref("/games").child(key);
		query.on('value', snap => {
			this.updateTurn(snap.val().turn);
			this.updatewon_Fields(snap.val().won_fields);
			this.updateFields(snap.val().fields);
			this.updateNextField(snap.val().nextField);
		});
	}

	update() {
		if (!this.key) return;
		const query = firebase.database().ref("/games").child(this.key);
		query.update({
			turn: !this.symbol,
			won_fields: this.won_fields,
			fields: this.fields,
			nextField: this.nextfield
		});
	}
	initField() {
		return [[[0, 0, 0], [0, 0, 0], [0, 0, 0]], [[0, 0, 0], [0, 0, 0], [0, 0, 0]], [[0, 0, 0], [0, 0, 0], [0, 0, 0]], [[0, 0, 0], [0, 0, 0], [0, 0, 0]], [[0, 0, 0], [0, 0, 0], [0, 0, 0]], [[0, 0, 0], [0, 0, 0], [0, 0, 0]], [[0, 0, 0], [0, 0, 0], [0, 0, 0]], [[0, 0, 0], [0, 0, 0], [0, 0, 0]], [[0, 0, 0], [0, 0, 0], [0, 0, 0]]];
	}
	initWon_Fields() {
		return [false, false, false, false, false, false, false, false, false];
	}

}
