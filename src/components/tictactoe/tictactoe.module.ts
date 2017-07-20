import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { TictactoeComponent } from './tictactoe';

@NgModule({
  declarations: [
    TictactoeComponent,
  ],
  imports: [
    IonicModule,
  ],
  exports: [
    TictactoeComponent
  ]
})
export class TictactoeComponentModule {}
