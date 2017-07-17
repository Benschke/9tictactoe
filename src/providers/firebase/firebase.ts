import { Injectable, EventEmitter } from '@angular/core';
import { AuthProvider } from '../auth/auth'
import * as firebase from 'firebase/app';

@Injectable()
export class FirebaseProvider {
  private gameRef: any;
  loggedIn = new EventEmitter();
  openLobbys = new EventEmitter();
  joinedLobby = new EventEmitter();
  newMessages = new EventEmitter();
  constructor(public auth: AuthProvider) {
    this.gameRef = firebase.database().ref('/games');
  }

  listenToLogginStatus(){
   firebase.auth().onAuthStateChanged(firebaseUser => this.loggedIn.emit(firebaseUser)); 
  }

  listenToOpenLobbys() {
    this.gameRef.orderByChild("state").equalTo(1).on('child_added', (snap) => {
      if (snap) this.openLobbys.emit(snap);
      else this.openLobbys.emit(Error("listenToOpenLobbys Error"));
    });
  }

  stopListenToOpenLobbys() {
    try {
      this.gameRef.orderByChild("state").equalTo(1).off('child_added');
    } catch (error) {
      alert("stopListenToOpenLobbys: " + error);
    }
  }

  setUpLobby(key, setupInfos) { // wenn lobby vorhanden und eine person joined
    const query = this.gameRef.child(key)
    return new Promise((resolve, reject) => {
      query.once('value', snap => {
        if (snap) {
          if (setupInfos) query.update(setupInfos);  // nur eine person muss sachen wie das start feld abspeichern danach speichert jede einmal nach seinen zug
          resolve(snap);
        }
        else reject(Error('setUpLobby Nullpointer'));
      });
    }
    );
  }

  createLobby(lobbyInfos) {
    this.gameRef.push().set(lobbyInfos);
    // id für ^ bekommen
    const query = this.gameRef.orderByChild('state_creator_uid').equalTo("1_" + this.auth.getUserUid()).limitToFirst(1);
    return new Promise((resolve, reject) => {
      query.once('value', snap => {
        let key: string = Object.keys(snap.val())[0];
        if (key) resolve(key);
        else reject(Error('createLobby Error'));
      });
    });
  }

  deleteOldLobby(){
    const query = this.gameRef.orderByChild('state_creator_uid').equalTo("1_" + this.auth.getUserUid()).limitToFirst(1);
      query.once('value', snap =>{
        if(!snap.val()) return;
        let key: string = Object.keys(snap.val())[0];
        this.deleteLobby(key);
      });
  }

  deleteLobby(key){
    this.gameRef.child(key).remove();
  }

  joinLobby(key) {
    let lobbyRef: any = this.gameRef.child(key);
    return new Promise((resolve, reject) => {
      lobbyRef.once('value', snap => {
        if (snap.val().creator_uid != this.auth.getUserUid()) {
          lobbyRef.update({
            joiner_uid: this.auth.getUserUid(),
            joiner_displayName: this.auth.getdisplayName(),
            state: 2
          });
          // this.enterGame(false, key);
          resolve(true);
        } else reject(Error('Cannot join own Lobby!'));
      });
    });
  }

  waitLobby(key) { // wait for lobby go be ready
    const query = this.gameRef.child(key);
    query.on('value', snap => {
      if (!snap.val().nextField && snap.val().state == 2) { // game noch nicht init == neue lobby && eine sich zwei spieler gefunden haben 
        this.joinedLobby.emit(true);
        query.off();
      }
    });
  }

  isUniqueLobby() {
    const query = this.gameRef.orderByChild('state_creator_uid').equalTo("1_" + this.auth.getUserUid()).limitToFirst(1);
    return new Promise((resolve, reject) => {
      query.once('value', snap => {
        if (!snap.val()) resolve(true);
        else reject(false);
      });
    });
  }

  startListenToMessages(key) {
    let query: any = this.gameRef.child(key).child('messages');
    query.on('child_added', (snap) => {
      if (snap.val()) this.newMessages.emit(snap);
    });
  }

  stopListenToMessages(key) {
    try{
      this.gameRef.child(key).child('messages').off('child_added');
    }catch(error){
      alert("stopListenToMessages: " + error);
    }
  }
  pushMessage(key,messageInfos){
    this.gameRef.child(key).child('messages').push(messageInfos);
  }
}
