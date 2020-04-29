import { NgModule } from '@angular/core';
import { FrLumos } from './fr-lumos.component';
import {CommonModule} from '@angular/common';


@NgModule({
  declarations: [FrLumos],
  imports: [CommonModule
  ],
  exports: [FrLumos]
})
export class FrLumosModule { }
