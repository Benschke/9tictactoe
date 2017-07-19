import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

/*
  Generated class for the TabsProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class TabsProvider {
  enabled;
  constructor() {
    this.enabled=true;
  }
  turnOn(){
    this.enabled = true;
  }
  turnOff(){
    this.enabled = false;
  }
  isEnabled(){
    return this.enabled;
  }

}
