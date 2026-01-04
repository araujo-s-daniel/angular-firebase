import { NgModule } from '@angular/core';

import { NgSelectModule } from '@ng-select/ng-select';

import { RequisicaoRoutingModule } from './requisicao-routing.module';
import { RequisicaoComponent } from './requisicao.component';
import { ComumModule } from 'src/app/modules/comum.module';
import { MovimentacaoComponent } from '../movimentacao/movimentacao.component';
import { ListaComponent } from '../movimentacao/lista/lista.component';

@NgModule({
  declarations: [
    RequisicaoComponent, MovimentacaoComponent, ListaComponent
  ],
  imports: [
    ComumModule,
    RequisicaoRoutingModule,
    NgSelectModule
  ]
})
export class RequisicaoModule { }
