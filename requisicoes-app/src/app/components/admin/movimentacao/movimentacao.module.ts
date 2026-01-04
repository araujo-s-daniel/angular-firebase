import { NgModule } from '@angular/core';

import { NgSelectModule } from '@ng-select/ng-select';

import { MovimentacaoRoutingModule } from './movimentacao-routing.module';
import { ComumModule } from 'src/app/modules/comum.module';

@NgModule({
  declarations: [],
  imports: [
    ComumModule,
    MovimentacaoRoutingModule,
    NgSelectModule
  ]
})
export class MovimentacaoModule { }
