import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { DepartamentoRoutingModule } from './departamento-routing.module';
import { DepartamentoComponent } from './departamento.component';
import { ComumModule } from 'src/app/modules/comum.module';

@NgModule({
  declarations: [
    DepartamentoComponent
  ],
  imports: [
    ComumModule,
    ReactiveFormsModule,
    DepartamentoRoutingModule
  ]
})
export class DepartamentoModule { }
