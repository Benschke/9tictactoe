import { Injectable,NgZone } from '@angular/core';
import { PlayerProvider } from '../player/player';
import 'rxjs/add/operator/map';
import * as firebase from 'firebase/app';

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
	constructor(public player: PlayerProvider, public zone: NgZone) { }
	resett(): void {
		this.won_fields = this.initWon_Fields();
		this.fields = this.initField();
		this.nextfield = [0, 1, 2, 3, 4, 5, 6, 7, 8];
	}
	updateTurn(turn): void {
		if (typeof (turn) != "undefined" && this.turn != turn) this.turn = turn; // sonst ist turn immer true weil if(false) direkt returnen würde
	}
	updatewon_Fields(wFs): void {
		if (!wFs) return;
		let iAr: any = [0, 1, 2, 3, 4, 5, 6, 7, 8];
		for (let i of iAr) {
			if (wFs[i] != this.won_fields[i]) this.won_fields[i] = wFs[i];
		}
	}
	updateFields(fields): void {
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
	updateNextField(nf): void {
		if (!nf) return;
		let iAr: any = [0, 1, 2, 3, 4, 5, 6, 7, 8];
		for (let i of iAr) {
			if (this.nextfield[i] != nf[i]) this.nextfield[i] = nf[i];
		}
	}
	initMultiplayer(key): void {
		this.key = key;
		this.resett();
		this.checkForUpdates(key);
	}

	checkForUpdates(key) {
		const query = firebase.database().ref("/games").child(key);
		query.on('value', snap => {
			this.zone.run(() => {
				this.updateTurn(snap.val().turn);
				this.updatewon_Fields(snap.val().won_fields);
				this.updateFields(snap.val().fields);
				this.updateNextField(snap.val().nextField);
			});
		});
	}

	update(): void {
		if (!this.key) {
			alert("!update");
			return;
		}
		const query = firebase.database().ref("/games").child(this.key);
		query.once('value', snap => {
			if (!snap.val() || snap.val().state == "DONE") return; // todo iwas wenn game zuende / gelöscht
			query.update({
				turn: !this.symbol,
				won_fields: this.won_fields,
				fields: this.fields,
				nextField: this.nextfield
			});
		})

	}
	initField(): any {
		return [[[0, 0, 0], [0, 0, 0], [0, 0, 0]], [[0, 0, 0], [0, 0, 0], [0, 0, 0]], [[0, 0, 0], [0, 0, 0], [0, 0, 0]], [[0, 0, 0], [0, 0, 0], [0, 0, 0]], [[0, 0, 0], [0, 0, 0], [0, 0, 0]], [[0, 0, 0], [0, 0, 0], [0, 0, 0]], [[0, 0, 0], [0, 0, 0], [0, 0, 0]], [[0, 0, 0], [0, 0, 0], [0, 0, 0]], [[0, 0, 0], [0, 0, 0], [0, 0, 0]]];
	}
	initWon_Fields(): any {
		return [false, false, false, false, false, false, false, false, false];
	}
	getScore(symbol):number{
		let counter:number=  0;
		for(let field of this.won_fields){
			if(field == symbol) ++counter;
		}
		return counter;
	}

}
