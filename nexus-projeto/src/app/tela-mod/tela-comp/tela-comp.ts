import { Component, ElementRef, ViewChild, HostListener } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';

// componente do chat simples
// selector e o nome da tag no html
// standalone true quer dizer que ele funciona sem precisar estar em um ngmodule
// imports lista modulos que o template usa como ngfor e ngmodel
@Component({
  selector: 'app-tela-comp',
  standalone: true,
  templateUrl: './tela-comp.html',
  styleUrls: ['./tela-comp.css'],
  imports: [CommonModule, FormsModule, NgFor]
})
export class TelaComp {
  // mensagens do chat (suporta mensagens especiais tipo "balao-acao")
  mensagem: Array<{
    text?: string;
    sender: 'usuario' | 'nexus';
    typing?: boolean;
    tipo?: 'balao-acao';
    textoAlvo?: string; // texto completo alvo do balão
    palavra?: string;   // palavra para definição no balão
    resumo?: string;
    definicao?: string;
    sinonimos?: string[];
  }> = [];

  // valor ligado ao campo de input com ngModel
  novaMensagem = '';

  // informações do usuário (recuperadas do localStorage após login)
  userNome: string = localStorage.getItem('usuario') || 'Usuário';
  userEmail: string = localStorage.getItem('email') || '';

  // controla visibilidade do bloco de perfil
  showPerfil: boolean = false;

  togglePerfil(): void {
    this.showPerfil = !this.showPerfil;
  }

  fecharPerfil(): void {
    this.showPerfil = false;
  }

  // ===== Texto alvo que ativa o balão =====
  texto: string = ' ';

  // Popover de seleção na lista de mensagens (grifar/definir/resumir)
  @ViewChild('mensagensArea') mensagensArea!: ElementRef<HTMLElement>;
  showPopup: boolean = false;
  popupX = 0;
  popupY = 0;
  private ultimoClickDentroPopup = false;

  // Balão flutuante de definição/resumo (verde), ancorado à seleção
  showBalaoAcao: boolean = false;
  balaoX = 0;
  balaoY = 0;
  balaoTitulo = '';
  balaoConteudo = '';
  balaoSinonimos: string[] = [];

  dicionario: Record<string, { significado: string; sinonimos: string[] }> = {
    'medo': { significado: 'Sentimento de apreensão ou pavor diante de algo perigoso ou desconhecido.', sinonimos: ['temor', 'receio', 'pavor'] },
    'pessoas': { significado: 'Seres humanos em geral; indivíduos.', sinonimos: ['indivíduos', 'gente'] },
    'comum': { significado: 'Algo frequente, habitual, compartilhado.', sinonimos: ['corriqueiro', 'habitual', 'frequente'] },
    'manifestar': { significado: 'Tornar evidente; mostrar-se.', sinonimos: ['demonstrar', 'revelar', 'aparecer'] },
    'maneiras': { significado: 'Modos ou formas de fazer algo.', sinonimos: ['formas', 'jeitos', 'modos'] },
    'teme': { significado: 'Ter medo; recear.', sinonimos: ['receia', 'teme', 'assusta-se'] },
    'lida': { significado: 'Tratar com; lidar com algo.', sinonimos: ['trata', 'enfrenta', 'administra'] },
    'afetar': { significado: 'Causar efeito; influenciar.', sinonimos: ['influenciar', 'impactar', 'atingir'] },
  };

  // exibe popover quando há seleção dentro da lista de mensagens
  onMouseUpMensagens(_event?: MouseEvent): void {
    const sel = this.getSelecaoIn(this.mensagensArea?.nativeElement);
    if (!sel || sel.isCollapsed) { this.showPopup = false; return; }
    const range = sel.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const host = this.mensagensArea?.nativeElement;
    if (!host) { this.showPopup = false; return; }
    const hostRect = host.getBoundingClientRect();
    // posiciona acima da seleção, com pequeno deslocamento
    this.popupX = Math.max(8, rect.left - hostRect.left);
    this.popupY = Math.max(8, rect.top - hostRect.top - 44);
    this.showPopup = true;
  }

  private getSelecaoIn(container?: HTMLElement | null): Selection | null {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return null;
    const range = sel.getRangeAt(0);
    return container && container.contains(range.commonAncestorContainer) ? sel : null;
  }

  // Resumo da seleção atual (mostra em balão verde)
  resumirSelecao(): void {
    const sel = this.getSelecaoIn(this.mensagensArea?.nativeElement);
    const alvo = sel && !sel.isCollapsed ? sel.toString() : '';
    if (!alvo) { this.showBalaoAcao = false; return; }
    const resumo = this.resumirSimples(alvo);
    this.mostrarBalaoAcao('Resumo', resumo, this.popupX, this.popupY);
  }

  resumirSimples(texto: string): string {
    const frases = texto.split(/(?<=[.!?])\s+/).filter(f => f.trim().length);
    if (frases.length <= 2) return frases.join(' ');
    return frases.slice(0, 2).join(' ');
  }

  grifarTexto(cor: 'vermelho' | 'azul' | 'verde'): void {
    const sel = this.getSelecaoIn(this.mensagensArea?.nativeElement);
    if (!sel || sel.isCollapsed) return;
    const range = sel.getRangeAt(0);
    const span = document.createElement('span');
    span.className = `marca-${cor}`;
    try { range.surroundContents(span); }
    catch {
      const conteudo = range.extractContents();
      span.appendChild(conteudo);
      range.insertNode(span);
    }
    sel.removeAllRanges();
    // mantém o popover visível
    this.onMouseUpMensagens();
  }

  limparGrifosTexto(): void {
    const container = this.mensagensArea?.nativeElement;
    if (!container) return;
    const marcados = container.querySelectorAll('span[class^="marca-"]');
    marcados.forEach(node => {
      const pai = node.parentNode as Node;
      while (node.firstChild) pai.insertBefore(node.firstChild, node);
      pai.removeChild(node);
    });
  }

  definirSelecao(): void {
    const sel = this.getSelecaoIn(this.mensagensArea?.nativeElement);
    const textoSel = sel && !sel.isCollapsed ? sel.toString().trim() : '';
    const titulo = textoSel || 'Palavra';
    const chave = (textoSel || '').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
    let conteudo = 'Sem definição local. (Dicionário offline)';
    let sins: string[] = [];
    const def = this.dicionario[chave];
    if (def) { conteudo = def.significado; sins = def.sinonimos; }
    this.mostrarBalaoAcao(titulo, conteudo, this.popupX, this.popupY, sins);
  }

  mostrarBalaoAcao(titulo: string, conteudo: string, x: number, y: number, sins: string[] = []): void {
    this.balaoTitulo = titulo;
    this.balaoConteudo = conteudo;
    this.balaoSinonimos = sins;
    this.balaoX = x;
    this.balaoY = y - 8; // pequeno ajuste
    this.showBalaoAcao = true;
  }

  // ações no balão de mensagem especial
  resumirTextoAlvo(msg: { textoAlvo?: string; resumo?: string }): void {
    msg.resumo = this.resumirSimples(msg.textoAlvo || '');
  }

  definirPalavraBalao(msg: { palavra?: string; definicao?: string; sinonimos?: string[] }): void {
    const chave = (msg.palavra || '').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
    const def = this.dicionario[chave];
    if (def) { msg.definicao = def.significado; msg.sinonimos = def.sinonimos; }
    else { msg.definicao = 'Sem definição local.'; msg.sinonimos = []; }
  }

  fecharPopup(): void {
    if (!this.ultimoClickDentroPopup) {
      this.showPopup = false;
    }
    this.ultimoClickDentroPopup = false;
  }

  // fecha com ESC
  @HostListener('document:keydown.escape')
  onEsc(): void {
    this.showPopup = false;
    this.showBalaoAcao = false;
  }

  // clique fora do popover
  @HostListener('document:click', ['$event'])
  onDocClick(ev: MouseEvent): void {
    const popup = document.getElementById('popup-selecao');
    if (popup && popup.contains(ev.target as Node)) {
      this.ultimoClickDentroPopup = true;
      return;
    }
    // se o clique foi fora da lista de mensagens e do popup, fecha
    const area = this.mensagensArea?.nativeElement;
    if (area && (ev.target instanceof Node) && (area.contains(ev.target) || popup?.contains(ev.target))) {
      const sel = this.getSelecaoIn(area);
      if (!sel || sel.isCollapsed) this.showPopup = false;
      return;
    }
    this.showPopup = false;
    this.showBalaoAcao = false;
  }

  // funcao usada pelo ngFor para melhorar desempenho
  // o angular usa esse valor para identificar cada item da lista
  trackByIndex(index: number): number {
    return index;
  }

  // quando o usuario envia uma mensagem este metodo e chamado
  // 1 pega o texto e tira espacos com trim
  // 2 se estiver vazio nao faz nada
  // 3 adiciona a mensagem do usuario na lista
  // 4 adiciona uma mensagem provisoria dizendo que o nexus esta digitando
  // 5 depois de um tempo substitui a mensagem provisoria por uma resposta gerada
  mandarMensagem(): void {
    const texto = this.novaMensagem.trim();
    if (!texto) return;

    // adiciona mensagem do usuario
    this.mensagem.push({ text: texto, sender: 'usuario' });
    this.novaMensagem = '';

    // adiciona placeholder de "digitando"
    this.mensagem.push({ text: 'nexus esta digitando', sender: 'nexus', typing: true });

    // apos um tempo substitui pela resposta final
    setTimeout(() => {
      // remove qualquer mensagem que estava marcada como digitando
      this.mensagem = this.mensagem.filter(m => !m.typing);

      if (texto === this.texto.trim()) {
        // mensagem específica: o nexus pergunta e entrega o balão de ações
        this.mensagem.push({ text: 'O que deseja fazer com o texto?', sender: 'nexus' });
        this.mensagem.push({ sender: 'nexus', tipo: 'balao-acao', textoAlvo: texto, palavra: '', resumo: '', definicao: '', sinonimos: [] });
      } else {
        const resposta = this.gerarRespostaAutomatica(texto);
        this.mensagem.push({ text: resposta, sender: 'nexus' });
      }
    }, 50);
  }

  // gera respostas com base em palavras chave do texto
  // tudo em minusculo e sem acentos para facilitar a verificacao
  gerarRespostaAutomatica(texto: string): string {
    const msg = texto.toLowerCase();

    if (msg.includes('oi') || msg.includes('ola') || msg.includes('bom dia')) {
      return 'ola sou o nexusbot como posso ajudar hoje';
    }
    if (msg.includes('seu nome')) {
      return 'meu nome e nexus seu assistente virtual';
    }
    if (msg.includes('hora')) {
      const agora = new Date();
      const hora = agora.toLocaleTimeString('pt-BR', 
        { hour: '2-digit', minute: '2-digit' });
      return `agora sao ${hora}`;
    }
    if (msg.includes('tempo') || msg.includes('previsao')) {
      return 'hoje o tempo esta limpo com temperatura agradavel';
    }
    if (msg.includes('ajuda') || msg.includes('funcionalidades')) {
      return 'posso responder perguntas simples mostrar hora e conversar um pouco';
    }

    return 'interessante mas ainda estou aprendendo a responder isso';
  }
}
