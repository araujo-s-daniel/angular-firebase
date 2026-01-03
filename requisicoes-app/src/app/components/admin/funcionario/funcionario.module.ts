import { NgModule } from '@angular/core';

import { NgSelectModule } from '@ng-select/ng-select';

import { FuncionarioRoutingModule } from './funcionario-routing.module';
import { FuncionarioComponent } from './funcionario.component';
import { ComumModule } from 'src/app/modules/comum.module';
import { FilterDepartamentoPipe } from 'src/app/pipes/filter-departamento.pipe';

@NgModule({
  declarations: [
    FuncionarioComponent, FilterDepartamentoPipe
  ],
  imports: [
    ComumModule,
    FuncionarioRoutingModule,
    NgSelectModule
  ]
})
export class FuncionarioModule { }
