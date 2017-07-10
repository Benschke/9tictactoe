import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { MaterialModule } from '@angular/material';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { GooglePlus } from '@ionic-native/google-plus';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { GamePage } from '../pages/game/game';
import { LoginPage } from '../pages/login/login';
import { LobbyPage } from '../pages/lobby/lobby';

import { BotProvider } from '../providers/bot/bot';
import { GameServiceProvider } from '../providers/game-service/game-service';
import { GamestatusProvider } from '../providers/gamestatus/gamestatus';
/* added */
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
// Do not import from 'firebase' as you'll lose the tree shaking benefits
import * as firebase from 'firebase/app';
//import firebase from 'firebase';
import {firebaseConfig} from '../environment';
import { PlayerProvider } from '../providers/player/player';
import { AuthProvider } from '../providers/auth/auth';

firebase.initializeApp(firebaseConfig);

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    GamePage,
    LoginPage,
    LobbyPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    MaterialModule,
    AngularFireModule.initializeApp(firebaseConfig, '9tictactoe'),
    AngularFireDatabaseModule, 
    AngularFireAuthModule, 
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    GamePage,
    LoginPage,
    LobbyPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    GooglePlus,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    BotProvider,
    GameServiceProvider,
    GamestatusProvider,
    PlayerProvider,
    AuthProvider
  ]
})
export class AppModule {}
