import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { Observable } from 'rxjs';

import { ServiceFirebase } from '../core/servicefirebase.service';
import { Funcionario } from '../models/funcionario.model';

@Injectable({
  providedIn: 'root'
})
export class FuncionarioService extends ServiceFirebase<Funcionario> {
  constructor(firestore: AngularFirestore) {
    super(Funcionario, firestore, 'funcionarios');
  }

  getFuncionarioLogado(email: string): Observable<Funcionario[]> {
    return this.firestore.collection<Funcionario>('funcionarios', ref => ref.where('email', '==', email)).valueChanges();
  }
}
