import { Component } from '@angular/core';

@Component({
  selector: 'app-config-comp',
  standalone: false,
  templateUrl: './config-comp.html',
  styleUrls: ['./config-comp.css']
})
export class ConfigComp {
  // Aparência (apenas visual dentro da página)
  tema: 'claro' | 'escuro' = 'escuro';
  corPrimaria = '#a855f7';
  corBarraLateral = '#111827';
  corConversa = '#0b0b0b';
  tamanhoFonte = 14; // px

  // Personalidade (visual; não impacta o chat)
  personalidade: 'Amigável' | 'Profissional' | 'Divertido' | 'Neutro' = 'Amigável';
  descricaoPersonalidade = '';
}
