import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { Funcionario } from 'src/app/models/funcionario.model';
import { Movimentacao, Requisicao } from 'src/app/models/requisicao.model';
import { RequisicaoService } from 'src/app/services/requisicao.service';

@Component({
  selector: 'app-movimentacao',
  templateUrl: './movimentacao.component.html',
  styleUrls: ['./movimentacao.component.css']
})
export class MovimentacaoComponent implements OnInit {

  @Input() funcionarioLogado: Funcionario;
  requisicoes$: Observable<Requisicao[]>;
  movimentacoes: Movimentacao[];
  requisicaoSelecionada: Requisicao;
  edit: boolean;
  displayDialogMovimentacao: boolean;
  displayDialogMovimentacoes: boolean;
  form: FormGroup;
  listaStatus: string[];

  constructor(private requisicaoService: RequisicaoService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.configForm();
    this.carregaStatus();
    this.listaRequisicoesDepartamento();
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

  listaRequisicoesDepartamento(): void {
    this.requisicoes$ = this.requisicaoService.list()
      .pipe(
        map((reqs: Requisicao[]) => reqs.filter(r => r.destino.nome === this.funcionarioLogado.departamento.nome))
      );
  }

  setValorPadrao(): void {
    this.form.patchValue({
      funcionario: this.funcionarioLogado,
      dataHora: new Date()
    });
    this.movimentacoes = [];
  }

  add(requisicao: Requisicao): void {
    this.form.reset();
    this.edit = false;
    this.setValorPadrao();
    this.requisicaoSelecionada = requisicao;
    this.movimentacoes = (!requisicao.movimentacoes ? [] : requisicao.movimentacoes);
    this.displayDialogMovimentacao = true;
  }

  save(): void {
    this.movimentacoes.push(this.form.value);
    this.requisicaoSelecionada.movimentacoes = this.movimentacoes;
    this.requisicaoSelecionada.status = this.form.controls['status'].value;
    this.requisicaoSelecionada.ultimaAtualizacao = new Date();
    this.requisicaoService.createOrUpdate(this.requisicaoSelecionada)
      .then(() => {
        this.displayDialogMovimentacao = false;
        Swal.fire(`Requisição ${!this.edit ? 'salvo' : 'atualizado'} com sucesso.`, '', 'success');
      })
      .catch((erro) => {
        this.displayDialogMovimentacao = true;
        Swal.fire(`Erro ao ${!this.edit ? 'salvar' : 'atualizar'} a Requisição.`, `Detalhes: ${erro}`, 'error');
      });
    this.form.reset();
  }

  onDialogClose(event): void {
    this.displayDialogMovimentacoes = event;
  }

  verMovimentacoes(requisicao: Requisicao): void {
    this.requisicaoSelecionada = requisicao;
    this.movimentacoes = requisicao.movimentacoes;
    this.displayDialogMovimentacoes = true;
  }

  delete(depto: Requisicao): void {
    Swal.fire({
      title: 'Confirma a exclusão do Requisição?',
      text: '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não'
    }).then((result) => {
      if (result.value) {
        this.requisicaoService.delete(depto.id)
          .then(() => {
            Swal.fire('Requisição excluído com sucesso!', '', 'success');
          });
      }
    });
  }
}
