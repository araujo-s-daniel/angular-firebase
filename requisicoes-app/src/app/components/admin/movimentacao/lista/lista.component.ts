import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import Swal from 'sweetalert2';

import { Movimentacao, Requisicao } from 'src/app/models/requisicao.model';
import { Funcionario } from 'src/app/models/funcionario.model';
import { RequisicaoService } from 'src/app/services/requisicao.service';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css']
})
export class ListaComponent implements OnInit {

  @Input() movimentacoes: Movimentacao[];
  @Input() requisicaoSelecionada: Requisicao;
  @Input() displayDialogMovimentacoes: boolean;
  @Input() funcionarioLogado: Funcionario;
  @Output() displayChange = new EventEmitter();

  listaStatus: string[];
  displayDialogMovimentacao: boolean;
  form: FormGroup;
  edit: boolean;
  indexMovimentacoes: number;

  constructor(
    private requisicaoService: RequisicaoService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.configForm();
    this.carregaStatus();
  }

  configForm(): void {
    this.form = this.fb.group({
      funcionario: new FormControl('', Validators.required),
      dataHora: new FormControl(''),
      status: new FormControl('', Validators.required),
      descricao: new FormControl('', Validators.required)
    });
  }

  carregaStatus(): void {
    this.listaStatus = ['Aberto', 'Pendente', 'Processando', 'Não autorizada', 'Finalizado'];
  }

  selecionaMovimento(mov: Movimentacao, index: number): void {
    this.edit = true;
    this.displayDialogMovimentacao = true;
    this.form.setValue(mov);
    this.indexMovimentacoes = index;
  }

  onClose(): void {
    this.displayChange.emit(false);
  }

  update(): void {
    this.movimentacoes[this.indexMovimentacoes] = this.form.value;
    this.requisicaoSelecionada.movimentacoes = this.movimentacoes;
    this.requisicaoSelecionada.status = this.form.controls['status'].value;
    this.requisicaoSelecionada.ultimaAtualizacao = new Date();
    this.requisicaoService.createOrUpdate(this.requisicaoSelecionada)
      .then(() => {
        this.displayDialogMovimentacao = false;
        Swal.fire(`Movimentação ${!this.edit ? 'salvo' : 'atualizado'} com sucesso.`, '', 'success');
      })
      .catch((erro) => {
        this.displayDialogMovimentacao = true;
        Swal.fire(`Erro ao ${!this.edit ? 'salvo' : 'atualizado'} o Movimentação.`, `Detalhes: ${erro}`, 'error');
      });
    this.form.reset();
  }

  remove(array: Movimentacao[], element: Movimentacao): Movimentacao[] {
    return array.filter(el => el !== element);
  }

  delete(mov: Movimentacao): void {
    const movs = this.remove(this.movimentacoes, mov);
    Swal.fire({
      title: 'Confirma a exclusão da Movimentação?',
      text: '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não'
    }).then((result) => {
      if (result.value) {
        this.requisicaoSelecionada.movimentacoes = movs;
        this.requisicaoService.createOrUpdate(this.requisicaoSelecionada)
          .then(() => {
            Swal.fire('Movimentação excluída com sucesso!', '', 'success');
            this.movimentacoes = movs;
          });
      }
    });
  }
}
