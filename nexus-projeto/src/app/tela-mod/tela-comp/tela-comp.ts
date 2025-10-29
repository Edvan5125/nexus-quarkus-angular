import { Component, ElementRef, ViewChild, HostListener } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';

// este e o componente do chat
// selector e o nome da tag que aparece no html
// standalone true quer dizer que ele funciona sem precisar de um ngmodule
// imports e a lista de modulos que o template usa como ngfor e ngmodel
// templateurl aponta para o arquivo de marcação html do componente
// styleurls contem a folha de estilos css especifica deste componente
// este componente e autocontido e pode ser usado diretamente em outras telas
@Component({
  selector: 'app-tela-comp',
  standalone: true,
  templateUrl: './tela-comp.html',
  styleUrls: ['./tela-comp.css'],
  imports: [CommonModule, FormsModule, NgFor]
})
export class TelaComp {
  // lista de mensagens do chat suporta mensagem especial chamada balao acao
  // cada item pode conter:
  // - text: conteudo textual simples da mensagem (opcional)
  // - sender: 'usuario' ou 'nexus' para diferenciar origem
  // - typing: flag usada para mostrar estado de digitando
  // - tipo: quando 'balao-acao' indica uma mensagem especial com botoes/acoes
  // - textoAlvo: texto completo que pode ser resumido/definido no balao
  // - palavra: termo alvo para definicao e sinonimos
  // - resumo: resultado de um resumo gerado
  // - definicao: significado da palavra
  // - sinonimos: lista de termos relacionados
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

  // valor ligado ao campo de input com ngmodel
  // o binding bidirecional permite ler e limpar o campo apos o envio
  novaMensagem = '';

  // informacoes do usuario recuperadas do localstorage apos login
  // chaves usadas: 'usuario' e 'email'; se ausentes aplica padroes
  // estes dados sao usados para personalizar a interface
  userNome: string = localStorage.getItem('usuario') || 'Usuário';
  userEmail: string = localStorage.getItem('email') || '';

  // controla a aparicao do bloco de perfil
  // alternado por toggleperfil e fechado por fecharperfil
  showPerfil: boolean = false;

  togglePerfil(): void {
    this.showPerfil = !this.showPerfil;
  }

  fecharPerfil(): void {
    this.showPerfil = false;
  }

  // texto alvo que ativa o balao de acoes
  // quando o usuario envia exatamente este texto o nexus cria uma mensagem
  // especial com opcoes de resumo e definicao em um balao de acoes
  texto: string = 'O medo é o que mais as pessoas têm em comum. Todos têm medo de alguma coisa. Mas esse medo pode se manifestar de muitas maneiras. Não é o que você teme, mas como você lida com ele. Como você se deixa afetar.';

  // popover que aparece quando voce seleciona um trecho para grifar definir ou resumir
  // mensagensarea referencia o container de mensagens para calcular selecao e posicao
  // showpopup controla a visibilidade do popover de acoes (grifar/definir/resumir)
  // popupx/popupy sao coordenadas relativas ao container mensagensarea
  // ultimoclickdentropopup ajuda a decidir se devemos fechar ao clicar fora
  @ViewChild('mensagensArea') mensagensArea!: ElementRef<HTMLElement>;
  showPopup: boolean = false;
  popupX = 0;
  popupY = 0;
  private ultimoClickDentroPopup = false;

  // balao flutuante de definicao ou resumo de cor verde ancorado na selecao
  // showbalaoacao liga/desliga o balao verde informativo
  // balaox/balaoy posicionam o balao perto do ponto de selecao
  // balaotitulo e balaconteudo exibem o resultado (resumo/definicao)
  // balaosinonimos lista sinonimos quando aplicavel
  showBalaoAcao: boolean = false;
  balaoX = 0;
  balaoY = 0;
  balaoTitulo = '';
  balaoConteudo = '';
  balaoSinonimos: string[] = [];

  // dicionario offline para definicoes e sinonimos
  // as chaves devem estar normalizadas em minusculo sem acentos 
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

  // mostra o popover quando existe selecao dentro da lista de mensagens
  // passos:
  // 1) pega a selecao atual do documento e verifica se esta dentro do container
  // 2) se estiver vazia (isCollapsed) oculta o popup
  // 3) calcula o retangulo da selecao e do container para obter posicao relativa
  // 4) posiciona o popup acima da selecao com margem minima e exibe
  onMouseUpMensagens(_event?: MouseEvent): void {
    const sel = this.getSelecaoIn(this.mensagensArea?.nativeElement);
    if (!sel || sel.isCollapsed) { this.showPopup = false; return; }
    const range = sel.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const host = this.mensagensArea?.nativeElement;
    if (!host) { this.showPopup = false; return; }
    const hostRect = host.getBoundingClientRect();
    // posiciona acima da selecao com pequeno deslocamento
    this.popupX = Math.max(8, rect.left - hostRect.left);
    this.popupY = Math.max(8, rect.top - hostRect.top - 44);
    this.showPopup = true;
  }

  // devolve a selecao somente se ela estiver contida dentro do container informado
  // isso evita abrir popups para selecoes fora da area de mensagens
  private getSelecaoIn(container?: HTMLElement | null): Selection | null {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return null;
    const range = sel.getRangeAt(0);
    return container && container.contains(range.commonAncestorContainer) ? sel : null;
  }

  // cria um resumo do texto selecionado e mostra no balao verde
  // usa resumirsimples para pegar as duas primeiras frases do trecho
  // mantem a posicao baseada nas coordenadas calculadas do popup
  resumirSelecao(): void {
    const sel = this.getSelecaoIn(this.mensagensArea?.nativeElement);
    const alvo = sel && !sel.isCollapsed ? sel.toString() : '';
    if (!alvo) { this.showBalaoAcao = false; return; }
    const resumo = this.resumirSimples(alvo);
    this.mostrarBalaoAcao('Resumo', resumo, this.popupX, this.popupY);
  }

  // resumo naive: divide por pontuacao e retorna ate duas frases
  // util para demonstracao sem libs externas
  resumirSimples(texto: string): string {
    const frases = texto.split(/(?<=[.!?])\s+/).filter(f => f.trim().length);
    if (frases.length <= 2) return frases.join(' ');
    return frases.slice(0, 2).join(' ');
  }

  // aplica marcação visual ao texto selecionado envolvendo com <span class="marca-cor">
  // tenta usar surroundcontents, se falhar (selecao cruzando nos) faz extraire inserir
  // ao final limpa a selecao e reabre o popup para permitir novas acoes
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
    // mantem o popover visivel
    this.onMouseUpMensagens();
  }

  // remove todas as marcacoes <span class="marca-..."> preservando o texto interno
  // desfaz grifos para restaurar o conteudo original renderizado
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

  // consulta o dicionario offline para a palavra selecionada
  // normaliza a chave para minusculo sem acentos (nfd + regex de diacriticos)
  // se nao houver definicao exibe mensagem padrao
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

  // configura e exibe o balao verde com titulo conteudo e sinonimos opcionais
  // y recebe um ajuste para evitar sobreposicao com o popup
  mostrarBalaoAcao(titulo: string, conteudo: string, x: number, y: number, sins: string[] = []): void {
    this.balaoTitulo = titulo;
    this.balaoConteudo = conteudo;
    this.balaoSinonimos = sins;
    this.balaoX = x;
    this.balaoY = y - 8; // ajuste
    this.showBalaoAcao = true;
  }

  // ações no balão de mensagem especial
  // preenche a propriedade resumo da mensagem especial usando o textoalvo
  resumirTextoAlvo(msg: { textoAlvo?: string; resumo?: string }): void {
    msg.resumo = this.resumirSimples(msg.textoAlvo || '');
  }

  // preenche definicao e sinonimos para a palavra do balao-acao
  // aplica a mesma normalizacao de chave usada em definirselecao 
  definirPalavraBalao(msg: { palavra?: string; definicao?: string; sinonimos?: string[] }): void {
    const chave = (msg.palavra || '').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
    const def = this.dicionario[chave];
    if (def) { msg.definicao = def.significado; msg.sinonimos = def.sinonimos; }
    else { msg.definicao = 'Sem definição local.'; msg.sinonimos = []; }
  }

  // fecha o popup caso o ultimo clique nao tenha sido dentro dele
  // usado em conjunto com o listener de clique no documento 
  fecharPopup(): void {
    if (!this.ultimoClickDentroPopup) {
      this.showPopup = false;
    }
    this.ultimoClickDentroPopup = false;
  }

  // fecha quando aperta a tecla esc
  @HostListener('document:keydown.escape')
  onEsc(): void {
    this.showPopup = false;
    this.showBalaoAcao = false;
  }

  // fecha quando clica fora do popover 
  // se o clique ocorrer dentro do popup marca a flag para nao fechar imediatamente
  // se o clique for dentro da area de mensagens valida a selecao antes de fechar
  // caso contrario fecha ambos popup e balao
  @HostListener('document:click', ['$event'])
  onDocClick(ev: MouseEvent): void {
    const popup = document.getElementById('popup-selecao');
    if (popup && popup.contains(ev.target as Node)) {
      this.ultimoClickDentroPopup = true;
      return;
    }
  // se o clique for fora da lista de mensagens e do popup fecha
    const area = this.mensagensArea?.nativeElement;
    if (area && (ev.target instanceof Node) && (area.contains(ev.target) || popup?.contains(ev.target))) {
      const sel = this.getSelecaoIn(area);
      if (!sel || sel.isCollapsed) this.showPopup = false;
      return;
    }
    this.showPopup = false;
    this.showBalaoAcao = false;
  }

  // funcao usada pelo ngfor para melhorar desempenho
  // o angular usa esse numero para identificar cada item da lista
  // evita recriar componentes quando apenas o conteudo muda
  trackByIndex(index: number): number {
    return index;
  }

  // quando o usuario envia uma mensagem este metodo e chamado
  // passo 1 pega o texto e remove espacos nas pontas com trim
  // passo 2 se ficar vazio nao faz nada
  // passo 3 adiciona a mensagem do usuario na lista
  // passo 4 adiciona uma mensagem provisoria dizendo que o nexus esta digitando
  // passo 5 depois de um tempo troca pela resposta gerada
  // observacao: o tempo curto (50ms) simula processamento assinc sem travar a ui
  mandarMensagem(): void {
    const texto = this.novaMensagem.trim();
    if (!texto) return;

  // adiciona a mensagem do usuario
    this.mensagem.push({ text: texto, sender: 'usuario' });
    this.novaMensagem = '';

  // adiciona um aviso de digitando
    this.mensagem.push({ text: 'nexus esta digitando', sender: 'nexus', typing: true });

    // depois de um tempo substitui pela resposta final
    setTimeout(() => {
      // remove qualquer mensagem que estava como digitando
      this.mensagem = this.mensagem.filter(m => !m.typing);

      if (texto === this.texto.trim()) {
        // se o texto e igual ao alvo o nexus pergunta e mostra o balao de acoes
        this.mensagem.push({ text: 'O que deseja fazer com o texto?', sender: 'nexus' });
        this.mensagem.push({ sender: 'nexus', tipo: 'balao-acao', textoAlvo: texto, palavra: '', resumo: '', definicao: '', sinonimos: [] });
      } else {
        const resposta = this.gerarRespostaAutomatica(texto);
        this.mensagem.push({ text: resposta, sender: 'nexus' });
      }
    }, 50);
  }

  // gera respostas simples com base em palavras chave do texto
  // tudo em minusculo e sem acentos para facilitar a verificacao
  // regras:
  // - saudações: oi/ola/bom dia
  // - nome: responde o nome do bot
  // - hora: usa tolocaletimestring pt-br com hh:mm
  // - tempo/previsao: resposta generica
  // - ajuda/funcionalidades: lista capacidades basicas
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
