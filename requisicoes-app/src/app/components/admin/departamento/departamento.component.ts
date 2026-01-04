import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

import { Departamento } from 'src/app/models/departamento.model';
import { DepartamentoService } from 'src/app/services/departamento.service';

@Component({
  selector: 'app-departamento',
  templateUrl: './departamento.component.html',
  styleUrls: ['./departamento.component.css']
})
export class DepartamentoComponent implements OnInit {

  departamentos$: Observable<Departamento[]>;
  edit: boolean;
  displayDialogDepartamento: boolean;
  form: FormGroup;

  constructor(private departamentoService: DepartamentoService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.departamentos$ = this.departamentoService.list();
    this.configForm();
  }

  configForm(): void {
    this.form = this.fb.group({
      id: new FormControl(),
      nome: new FormControl('', Validators.required),
      telefone: new FormControl('')
    });
  }

  add(): void {
    this.form.reset();
    this.edit = false;
    this.displayDialogDepartamento = true;
  }

  selecionaDepartamento(depto: Departamento): void {
    this.edit = true;
    this.displayDialogDepartamento = true;
    this.form.setValue(depto);
  }

  save(): void {
    this.departamentoService.createOrUpdate(this.form.value)
      .then(() => {
        this.displayDialogDepartamento = false;
        Swal.fire(`Departamento ${!this.edit ? 'salvo' : 'atualizado'} com sucesso.`, '', 'success');
      })
      .catch((erro) => {
        this.displayDialogDepartamento = true;
        Swal.fire(`Erro ao ${!this.edit ? 'salvar' : 'atualizar'} o departamento.`, `Detalhes: ${erro}`, 'error');
      });
    this.form.reset();
  }

  delete(depto: Departamento): void {
    Swal.fire({
      title: 'Confirma a exclusão do departamento?',
      text: '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não'
    }).then((result) => {
      if (result.value) {
        this.departamentoService.delete(depto.id)
          .then(() => {
            Swal.fire('Departamento excluído com sucesso!', '', 'success');
          });
      }
    });
  }
}
