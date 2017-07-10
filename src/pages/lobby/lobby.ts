import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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
	gameType;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  	this.gameType = this.navParams.get('type');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LobbyPage');
  }

}
