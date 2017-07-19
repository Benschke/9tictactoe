import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TabsPage } from './tabs';
// import { GamePage } from '../game/game';

@NgModule({
  declarations: [
    TabsPage
    // GamePage,
  ],
  imports: [
    IonicPageModule.forChild(TabsPage),
  ]
})
export class TabsPageModule {}
