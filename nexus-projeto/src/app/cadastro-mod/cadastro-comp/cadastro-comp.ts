import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastro-comp',
  standalone: false,
  templateUrl: './cadastro-comp.html',
  styleUrls: ['./cadastro-comp.css']
})
export class CadastroComp {
  // campos do formulario de cadastro
  usuario: string = '';
  email: string = '';
  senha: string = '';
  tipoUsuario: string = ''; // Dislexicia ou TDAH


  mensagemErro: string = '';
  mensagemSucesso: string = '';

  constructor(private router: Router) {}

  
  onTipoChange(event: Event): void {
    const alvo = event.target as HTMLSelectElement | null;
    this.tipoUsuario = alvo?.value ?? '';
  }

  cadastrar(): void {
    // validacao: todos os campos devem estar preenchidos
    if (!this.usuario.trim() || !this.email.trim() || !this.senha.trim() || !this.tipoUsuario.trim()) {
      this.mensagemSucesso = '';
      this.mensagemErro = 'Preencha usuário, e-mail, senha e o tipo de usuário.';
      return;
    }

    //  cadastro bem-sucedido
    this.mensagemErro = '';
    this.mensagemSucesso = 'Cadastro realizado com sucesso! Voltando para a tela de login...';

    // volta para a tela de login 
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 1000);
  }
}
