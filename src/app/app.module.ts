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
import { RulesPage } from '../pages/rules/rules';
import { TabsPage } from '../pages/tabs/tabs';
import { StatsPage } from '../pages/stats/stats';

import { TimeLeftBarComponent } from '../components/time-left-bar/time-left-bar';
import { TictactoeComponent } from '../components/tictactoe/tictactoe';

import { BotProvider } from '../providers/bot/bot';
import { GameServiceProvider } from '../providers/game-service/game-service';
import { GamestatusProvider } from '../providers/gamestatus/gamestatus';
import { PlayerProvider } from '../providers/player/player';
import { AuthProvider } from '../providers/auth/auth';
import { FirebaseProvider } from '../providers/firebase/firebase';
import { ProfileProvider } from '../providers/profile/profile';
import { Camera } from '@ionic-native/camera';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
// Do not import from 'firebase' as you'll lose the tree shaking benefits
// import * as firebase from 'firebase/app';
import firebase from 'firebase';
//import firebase from 'firebase';
import { firebaseConfig } from '../environment';

import { ChartsModule } from 'ng2-charts';


firebase.initializeApp(firebaseConfig);

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    GamePage,
    LoginPage,
    LobbyPage,
    RulesPage,
    TabsPage,
    StatsPage,
    TimeLeftBarComponent,
    TictactoeComponent,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    MaterialModule,
    AngularFireModule.initializeApp(firebaseConfig, '9tictactoe'),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    ChartsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    GamePage,
    LoginPage,
    LobbyPage,
    RulesPage,
    TabsPage,
    StatsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    GooglePlus,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    BotProvider,
    GameServiceProvider,
    GamestatusProvider,
    PlayerProvider,
    AuthProvider,
    FirebaseProvider,
    ProfileProvider,
    Camera
  ]
})
export class AppModule { }
