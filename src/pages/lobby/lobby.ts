import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Component } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import * as firebase from 'firebase/app';

import { AuthProvider } from '../../providers/auth/auth';

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
  created:boolean = false;
	items: FirebaseListObservable<any[]>;
	ref = firebase.database().ref("/games");
	gameType;
	lobbys;
  constructor(public navCtrl: NavController, public navParams: NavParams, public db: AngularFireDatabase, public auth: AuthProvider) {
  	this.gameType = this.navParams.get('type');
  	this.lobbys = this.ref.orderByChild('state').equalTo(1);
    this.items = db.list('/games',{
    	query:{
    		orderByChild: 'state',
    		equalTo: 1
    	}
    });  	
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LobbyPage');
  }

  createGame(){
    if(!this.created){
    	let user:any = firebase.auth().currentUser;
    	let currentGame:any = {
    		creator: {uid: user.uid, displayName: this.auth.getdisplayName},
    		// joiner: null,
    		state: 1 // open
    	};
    	this.ref.push().set(currentGame);
      this.created = !this.created;
    }
  }

  joinGame(key){
  	let user:any = firebase.auth().currentUser;
  	let gameRef:any = this.ref.child(key.$key);
    console.log(gameRef);
  	gameRef.transaction(function(game){ // falls mehrere spieler gleichzeitig gleiche lobby joinen wollen würden 
      if(game){
      		if(game.creator.uid != user.uid) return false;
      		if(!game.joiner){  			
      			game.state = 2; // joined
      			game.joiner = {uid: user.uid, displayName: this.auth.getdisplayName};
      		}
          console.log(game);
      		return game;
      }
  	});
  	alert("Failed to join!");
  }

}
