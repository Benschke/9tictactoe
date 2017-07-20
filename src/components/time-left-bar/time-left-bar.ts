import { Component,Input } from '@angular/core';

/**
 * Generated class for the TimeLeftBarComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'time-left-bar',
  templateUrl: 'time-left-bar.html'
})
export class TimeLeftBarComponent {
   @Input('text') text: string;
   @Input('percentLeft') percentLeft: number;
   @Input('innerColor') innerColor: string; 
  constructor() {}

}
