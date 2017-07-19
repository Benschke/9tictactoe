import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { TabsProvider } from '../../providers/tabs/tabs';

/**
 * Generated class for the TabsPage tabs.
 *
 * See https://angular.io/docs/ts/latest/guide/dependency-injection.html for
 * more info on providers and Angular DI.
 */
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
@IonicPage()
export class TabsPage {

  gameRoot = 'GamePage'
  statsRoot = 'StatsPage'
  rulesRoot = 'RulesPage'


  constructor(public navCtrl: NavController, public tab: TabsProvider) {}

}
