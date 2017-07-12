import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import * as firebase from 'firebase/app';
import { GooglePlus } from '@ionic-native/google-plus';
import { webClientIdGooglePlusApi } from '../../environment';
import { GamestatusProvider } from '../../providers/gamestatus/gamestatus';

@Injectable()
export class AuthProvider {
  constructor(public googleplus: GooglePlus, public gameStatus: GamestatusProvider) { }
  signInAnonym() {
    firebase.auth().signInAnonymously();
  }
  signInGoogle() {
    this.googleplus.login({
      'webClientId': webClientIdGooglePlusApi,
      'offline': true
    })
      .then((res) => {
        const firecreds = firebase.auth.GoogleAuthProvider.credential(res.idToken);
        firebase.auth().signInWithCredential(firecreds).then((success) => {
          return true;
        }).catch((err) => {
          alert('Firebase auth failed ' + err);
        })
      }).catch((err) => {
        alert('Error:' + err);
        return false;
      });
  }

  signOut() {
    firebase.auth().signOut();
  }

  getcurrentUser() {
    return firebase.auth().currentUser;
  }
  getdisplayName() {
    //return (firebase.auth().currentUser.isAnonymous) ? "Guest-" + firebase.auth().currentUser.uid : firebase.auth().currentUser.displayName;
    return (firebase.auth().currentUser.isAnonymous) ? "Guest" : firebase.auth().currentUser.displayName;
  }

  getUserUid() {
    return this.getcurrentUser().uid;
  }
}
