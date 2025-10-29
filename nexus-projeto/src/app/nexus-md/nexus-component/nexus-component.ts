import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nexus-component',
  standalone: true,
  templateUrl: './nexus-component.html',
  styleUrls: ['./nexus-component.css'],
  imports: [FormsModule, CommonModule]
})
export class NexusComponent {
  usuario: string = '';
  password: string = '';
  email: string = 'teste123@gmail.com';
  mensagemErro: string = '';

  constructor(private router: Router) {}

  entrar(): void {
    // validacao basica campos nao vazios
    if (!this.usuario.trim() || !this.password.trim() || !this.email.trim()) {
      this.mensagemErro = 'Preencha usuário, senha e e-mail para continuar.';
      return;
    }

    // autenticacao pedida pelo usuario usuario Edvan e senha 1234
    if (this.usuario === 'Edvan' && this.password === '1234') {
  // guarda o nome e email no localstorage para usar depois se quiser
  localStorage.setItem('usuario', this.usuario);
  localStorage.setItem('email', this.email);

      // limpa a mensagem de erro e navega para a rota tela
      this.mensagemErro = '';
      this.router.navigate(['/tela']);
      return;
    }

    // caso contrario mostra erro
    this.mensagemErro = 'Usuário ou senha incorretos.';
  }
}
