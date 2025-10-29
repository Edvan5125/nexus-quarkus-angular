// este e o componente raiz do app
// ele define o seletor o html e o css principal
// o sinal title guarda o nome do projeto de um jeito reativo
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('nome-projeto');
}
