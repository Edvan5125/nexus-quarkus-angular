import { Component } from '@angular/core';

@Component({
  selector: 'app-adm-comp',
  standalone: false,
  templateUrl: './adm-comp.html',
  styleUrls: ['./adm-comp.css']
})
export class AdmComp {
  typeUsuario: 'Dislexicia' | 'TDAH' = 'TDAH';

  usuarios: {id: number; usuario: string; email: string; tipoUsuario: 'Dislexicia' | 'TDAH'}[] = [];

  private mockUsuarios: {id: number; usuario: string; email: string; tipoUsuario: 'Dislexicia' | 'TDAH'}[] = [
    { id: 1, usuario: 'Exemplo1', email: 'exemplo1@email.com', tipoUsuario: 'TDAH' },
    { id: 2, usuario: 'Exemplo2', email: 'exemplo2@email.com', tipoUsuario: 'Dislexicia' }
  ];

  novoUsuario: { usuario: string; email: string; senha: string; tipoUsuario: 'Dislexicia' | 'TDAH' | '' } = {
    usuario: '',
    email: '',
    senha: '',
    tipoUsuario: ''
  };

  // estado de edicao
  editandoId: number | null = null;
  mensagemErro: string = '';
  mensagemSucesso: string = '';

  constructor() {}

  // carrega os usuarios quando o componente iniciar
  ngOnInit() {

  }

  listar() {
    this.usuarios = this.mockUsuarios.map(u => ({ ...u }));
  }

  // cria um novo usuario 
  criar() {
    this.mensagemErro = '';
    this.mensagemSucesso = '';
  }

  iniciarEdicao(u: { id: number; usuario: string; email: string; tipoUsuario: 'Dislexicia' | 'TDAH' }) {
    this.editandoId = u.id;
    this.novoUsuario = {
      usuario: u.usuario,
      email: u.email,
      senha: '', 
      tipoUsuario: u.tipoUsuario
    };
    this.mensagemErro = '';
    this.mensagemSucesso = '';
  }

  salvarEdicao() {

    this.mensagemErro = '';
    this.mensagemSucesso = '';
  }

  cancelarEdicao() {
    this.editandoId = null;
    this.limparFormulario();
    this.mensagemErro = '';
    this.mensagemSucesso = '';
  }

  // remove um usuario
  remover(_id: number) {

    this.mensagemErro = '';
    this.mensagemSucesso = '';
  }

  private validarFormulario(_edicao: boolean = false): boolean {
    if (!this.novoUsuario.usuario.trim() || !this.novoUsuario.email.trim() || !this.novoUsuario.tipoUsuario) {
      this.mensagemSucesso = '';
      this.mensagemErro = 'Preencha usuário, e-mail e tipo de usuário.';
      return false;
    }

    if (!_edicao && !this.novoUsuario.senha.trim()) {
      this.mensagemSucesso = '';
      this.mensagemErro = 'Informe uma senha para criar o usuário.';
      return false;
    }
    return true;
  }

  // limpa o formulario
  private limparFormulario() {
    this.novoUsuario = { usuario: '', email: '', senha: '', tipoUsuario: '' };
  }

  onTipoChange(event: Event) {
    const alvo = event.target as HTMLSelectElement | null;
    this.novoUsuario.tipoUsuario = (alvo?.value as any) ?? '';
  }
}
