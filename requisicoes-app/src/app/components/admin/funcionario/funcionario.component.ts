import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireUploadTask, AngularFireStorage } from '@angular/fire/storage';

import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

import { Funcionario } from 'src/app/models/funcionario.model';
import { Departamento } from 'src/app/models/departamento.model';
import { FuncionarioService } from 'src/app/services/funcionario.service';
import { DepartamentoService } from 'src/app/services/departamento.service';

@Component({
  selector: 'app-funcionario',
  templateUrl: './funcionario.component.html',
  styleUrls: ['./funcionario.component.css']
})
export class FuncionarioComponent implements OnInit {

  funcionarios$: Observable<Funcionario[]>;
  departamentos$: Observable<Departamento[]>;
  departamentoFiltro: string;
  edit: boolean;
  displayDialogFuncionario: boolean;
  form: FormGroup;

  @ViewChild('inputFile', { static: false }) inputFile: ElementRef;
  uploadPercent: Observable<number>;
  downloadURL: Observable<string>;
  task: AngularFireUploadTask;
  complete: boolean;

  constructor(
    private storage: AngularFireStorage,
    private funcionarioService: FuncionarioService,
    private departamentoService: DepartamentoService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.funcionarios$ = this.funcionarioService.list();
    this.departamentos$ = this.departamentoService.list();
    this.departamentoFiltro = 'TODOS';
    this.configForm();
  }

  configForm(): void {
    this.form = this.fb.group({
      id: new FormControl(),
      nome: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      funcao: new FormControl(''),
      departamento: new FormControl('', Validators.required),
      foto: new FormControl()
    });
  }

  add(): void {
    this.form.reset();
    this.edit = false;
    this.displayDialogFuncionario = true;
  }

  selecionaFuncionario(func: Funcionario): void {
    this.edit = true;
    this.displayDialogFuncionario = true;
    this.form.setValue(func);
  }

  save(): void {
    this.funcionarioService.createOrUpdate(this.form.value)
      .then(() => {
        this.displayDialogFuncionario = false;
        Swal.fire(`Funcionário ${!this.edit ? 'salvo' : 'atualizado'} com sucesso.`, '', 'success');
      })
      .catch((erro) => {
        this.displayDialogFuncionario = true;
        Swal.fire(`Erro ao ${!this.edit ? 'salvar' : 'atualizar'} o Funcionário.`, `Detalhes: ${erro}`, 'error');
      });
    this.form.reset();
  }

  delete(depto: Funcionario): void {
    Swal.fire({
      title: 'Confirma a exclusão do Funcionário?',
      text: '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não'
    }).then((result) => {
      if (result.value) {
        this.funcionarioService.delete(depto.id)
          .then(() => {
            Swal.fire('Funcionario excluído com sucesso!', '', 'success');
          });
      }
    });
  }

  async upload(event): Promise<void> {
    this.complete = false;
    const file = event.target.files[0];
    const path = `funcionarios/${new Date().getTime().toString()}`;
    const fileRef = this.storage.ref(path);
    this.task = this.storage.upload(path, file);
    this.task.then(up => {
      fileRef.getDownloadURL().subscribe(url => {
        this.complete = true;
        this.form.patchValue({
          foto: url
        });
      });
    });
    this.uploadPercent = this.task.percentageChanges();
    this.inputFile.nativeElement.value = '';
  }
}
