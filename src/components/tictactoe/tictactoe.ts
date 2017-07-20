import { Component, Input,Output, EventEmitter } from '@angular/core';

/**
 * Generated class for the TictactoeComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'tictactoe',
  templateUrl: 'tictactoe.html'
})
export class TictactoeComponent {
  @Input('Index') Index: number; 
  @Input('field') field: any;
  @Input('fieldClass') fieldClass: any; // selected || ein spieler hat gewonnen
  @Output() playerClicked = new EventEmitter();
  constructor() {  }
  playerClick(x,y,z){
    console.log(this.fieldClass);
    this.playerClicked.emit([x,y,z]);
  }
}
