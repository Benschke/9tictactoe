import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { GamePage } from '../game/game';
import { LobbyPage } from '../lobby/lobby';
import { RulesPage } from '../rules/rules';
import { GameServiceProvider } from '../../providers/game-service/game-service';
import { GamestatusProvider } from '../../providers/gamestatus/gamestatus';

@Component({
	selector: 'page-home',
	templateUrl: 'home.html',
	// providers: [GameServiceProvider,GamestatusProvider]
})
export class HomePage {
	gamePage = GamePage;
	lobbyPage = LobbyPage;
	rulesPage = RulesPage;
	user;
	constructor(public navCtrl: NavController, public gs: GameServiceProvider, public gameStatus: GamestatusProvider) {
		this.user = this.gameStatus.players[0].name;
	}
}