import { Component, ElementRef, ViewChild, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  // - text: conteudo textual da mensagem (opcional)
  // - sender: 'usuario' ou 'nexus' para diferenciar
  // - typing: usada para mostrar estado de digitando
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
  //  permite ler e limpar o campo apos o envio
  novaMensagem = '';

  // informacoes do usuario pegadas do localstorage apos login
  // chaves usadas: 'usuario' e 'email'; se nao tem aplica padrao
  // estes dados sao usados para personalizar a interface
  userNome: string =   localStorage.getItem('usuario') || 'Usuário';
  userEmail: string = localStorage.getItem('email') || '';

  // gamificação: pontos, nível e progresso (sem persistência; reinicia a cada recarga)
  pontos: number = 0;
  nivel: number = Math.floor(this.pontos / 100) + 1;
  progressoNivel: number = this.pontos % 100; // 0..99
  // histórico de pontos e notificação
  historicoPontos: Array<{ quando: string; qtd: number; motivo: string }> = [];
  notificacaoPontos: number = 0;
  showPontos: boolean = false;


  // ===== Conquistas (Realizações) =====
  // contadores e estado persistido
  contResumos: number = 0;
  contDefinicoes: number = 0;

  conquistas: Array<{ chave: string; titulo: string; descricao: string; desbloqueada: boolean; quando?: string }> = (() => {
    const padrao = [
      { chave: 'PRIMEIRO_RESUMO', titulo: 'Primeiro Resumo', descricao: 'Você criou seu primeiro resumo.', desbloqueada: false },
      { chave: 'RESUMIDOR_RAPIDO', titulo: 'Resumidor Rápido', descricao: 'Resumiu 10 textos.', desbloqueada: false },
      { chave: 'ESPECIALISTA_DEFINICAO', titulo: 'Especialista em Definição', descricao: 'Definiu 10 palavras.', desbloqueada: false },
    ];
    return padrao;
  })();

  historicoConquistas: Array<{ quando: string; titulo: string; mensagem: string }> = [];
  notificacaoConquistas: number = 0;
  showConquistas: boolean = false;

  // (removidos) textos pré-definidos


  // controla o bloco de perfil
  // alternado por toggleperfil e fechado por fecharperfil
  showPerfil: boolean = false;

  togglePerfil(): void {

    this.showPerfil =  !this.showPerfil;

  }

  fecharPerfil(): void {
    this.showPerfil = false;

  }

  constructor(private router: Router) {}

  // texto que ativa o balao de acoes
  // quando o usuario envia exatamente este texto o nexus cria uma mensagem
  // especial com opcoes de resumo e definicao em um balao de acoes
  texto: string = 'O medo é o que mais as pessoas têm em comum. Todos têm medo de alguma coisa. Mas esse medo pode se manifestar de muitas maneiras. Não é o que você teme, mas como você lida com ele. Como você se deixa afetar.';

  // o texto que aparece quando voce seleciona um trecho para resumir ou definir
  // mensagensarea referencia o container de mensagens para calcular selecao e posicao
  // showpopup controla a visibilidade do texto de acoes (resumir/definir)
  // popupx/popupy sao para mostar onde vai aparecer o texto ao container mensagensarea
  // ultimoclickdentropopup ajuda a decidir se fechar ao clicar fora
  @ViewChild('mensagensArea') mensagensArea!: ElementRef<HTMLElement>;
  showPopup: boolean = false;

  popupX =0;
  popupY = 0;
  private ultimoClickDentroPopup = false;

  // balao  de definicao ou resumo de cor verde linkado na selecao
  // showbalaoacao liga/desliga o balao verde
  // balaox/balaoy posicionam o balao perto do ponto de selecao
  // balaotitulo e balaconteudo exibem o resultado (resumo/definicao)
  // balaosinonimos lista sinonimos quando pedir
  showBalaoAcao: boolean = false;
  balaoX = 0;
  balaoY = 0;
  balaoTitulo = '';

  balaoConteudo = '';

  balaoSinonimos: string[] = [];


  // dicionario para definicoes e sinonimos
  // as chaves devem estart em minusculo sem acentos 
  dicionario: Record<string, {significado: string; sinonimos: string[]}> = {
    'medo': { 

      significado: 'Sentimento de apreensão ou pavor diante de algo perigoso ou desconhecido.', sinonimos: ['temor', 'receio', 'pavor'] 
    },

    'pessoas': { 

      significado: 'Seres humanos em geral; indivíduos.', sinonimos: ['indivíduos', 'gente'] 

    },
    'comum': { 
      significado: 'Algo frequente, habitual, compartilhado.', sinonimos: ['corriqueiro', 'habitual', 'frequente'] 
    },

    'manifestar': { 

      significado: 'Tornar evidente; mostrar-se.', sinonimos: ['demonstrar', 'revelar', 'aparecer'] 

    },
    'maneiras': {

       significado: 'Modos ou formas de fazer algo.', sinonimos: ['formas', 'jeitos', 'modos'] 

    },
    'teme': { 

      significado:  'Ter medo; recear.', sinonimos: ['receia', 'teme', 'assusta-se'] 
    },
    'lida': { 

      significado: 'Tratar com; lidar com algo.', sinonimos: [ 'trata', 'enfrenta', 'administra'] 
    },

    'afetar': { 
      significado: 'Causar efeito; influenciar.' ,  sinonimos: ['influenciar', 'impactar', 'atingir'] 
    },
  };

  // mostra o popop quando existe selecao dentro da lista de mensagens
  // passos:
  // 1 pega a selecao atual do documento e verifica se esta dentro do container
  // 2 se estiver vazia (isCollapsed) oculta o popup
  // 3 calcula o retangulo da selecao e do container para obter posicao relativa
  // 4 posiciona o popup acima da selecao com margem minima e exibe
  onMouseUpMensagens(_event?: MouseEvent): void {
    const sel = this.getSelecaoIn(this.mensagensArea?.nativeElement);
    if (!sel || sel.isCollapsed) { this.showPopup = false; return; }
    const range = sel.getRangeAt(0);
     const rect =range.getBoundingClientRect();

    const host = this.mensagensArea?.nativeElement;
    if (!host) { this.showPopup = false; return; }
    const hostRect = host.getBoundingClientRect();
    // posiciona acima da selecao 
    this.popupX =  Math.max(8, rect.left - hostRect.left);
    this.popupY = Math.max(8, rect.top - hostRect.top - 44);
    this.showPopup =  true;
  }

  // devolve a selecao somente se ela estiver dentro do container 
  // isso ai evita abrir popups para selecoes fora da area de mensagens
  private getSelecaoIn(container?: HTMLElement | null):  Selection | null {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0)  return null;
    const range = sel.getRangeAt(0);
    return container && container.contains(range.commonAncestorContainer) ? sel : null;
  }

  // cria um resumo do texto selecionado e mostra no balao verde
  // usa resumirsimples para pegar as duas primeiras frases do trecho
  // mantem a posicao baseada nas coordenadas calculadas do popup
  resumirSelecao(): void {
    const  sel = this.getSelecaoIn(this.mensagensArea?.nativeElement);
    const alvo = sel && !sel.isCollapsed ? sel.toString() : '';
    if (!alvo) { this.showBalaoAcao = false; return;}

    const resumo = this.resumirSimples(alvo);
    this.mostrarBalaoAcao('Resumo', resumo, this.popupX, this.popupY);
    this.ganharPontos(10, 'resumir um trecho');
    this.contResumos++; this.salvarContadores(); this.checkConquistas();
  }

  // resumo naive: divide por pontuacao e retorna ate duas frases

  resumirSimples(texto: string): string {
    const frases = texto.split(/(?<=[.!?])\s+/).filter(f => f.trim().length);
    if (frases.length <= 2)   return frases.join(' ');
    return frases.slice(0, 2).join(' ');
  }


  // consulta o dicionario pra a palavra selecionada
  // deixa a chave minusculo sem acentos 
  // se nao houver definicao exibe mensagem padrao
  definirSelecao(): void {
    const sel = this.getSelecaoIn(this.mensagensArea?.nativeElement);
    const textoSel =   sel && !sel.isCollapsed ? sel.toString().trim() : '';
    const titulo = textoSel || 'Palavra';
    const chave = (textoSel || '').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
    let conteudo = 'Sem definição';
    let sins: string[] = [];
    const def = this.dicionario[chave];
    if (def) { conteudo = def.significado; sins = def.sinonimos; }
    this.mostrarBalaoAcao(titulo, conteudo,  this.popupX, this.popupY, sins);
    if (textoSel) { this.ganharPontos(5, 'definir uma palavra'); this.contDefinicoes++; this.salvarContadores(); this.checkConquistas(); }
  }

  // configura e exibe o balao verde com titulo conteudo e alguns sinonimos
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
  resumirTextoAlvo(msg: {textoAlvo?: string; resumo?: string}): void {
    msg.resumo =   this.resumirSimples(msg.textoAlvo || '');
    this.contResumos++; this.salvarContadores(); this.checkConquistas();
  }

  // preenche definicao e sinonimos para a palavra do balao-acao
  // aplica a mesma regra de chave usada em definirselecao 
  definirPalavraBalao(msg: { palavra?: string; definicao?: string; sinonimos?: string[] }): void {
    const chave = (msg.palavra || '').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
    const def = this.dicionario[chave];
    if (def) { msg.definicao = def.significado; msg.sinonimos = def.sinonimos; }
    else { msg.definicao = 'Sem definição local.'; msg.sinonimos = []; }
    if (msg.palavra && msg.palavra.trim()) { this.ganharPontos(5, 'definir uma palavra'); this.contDefinicoes++; this.salvarContadores(); this.checkConquistas(); }
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
  // se o clique for dentro do popup marca a flag para nao fechar imediatamente
  // se o clique for dentro da area de mensagens valida a selecao antes de fechar
  // caso contrario fecha os dois popup e balao
  @HostListener('document:click', ['$event'])
  onDocClick(ev: MouseEvent): void {

    const popup =document.getElementById('popup-selecao');
    if (popup && popup.contains(ev.target as Node)) {
      this.ultimoClickDentroPopup = true;

      return;
    }
  // se o clique for fora da lista de mensagens e do popup fecha
    const area = this.mensagensArea?.nativeElement;
    if (area && (ev.target instanceof Node) && (area.contains(ev.target) || popup?.contains(ev.target))) {
      const sel = this.getSelecaoIn(area);
      if (!sel || sel.isCollapsed) 
        this.showPopup = false;
      return;
    }
    this.showPopup = false;
    this.showBalaoAcao = false;
  }

  // o angular usa esse numero para identificar cada item da lista
  // evita recriar componentes quando apenas o conteudo muda
  trackByIndex(index: number):  number {
    return index;
  }

  // quando o usuario envia uma mensagem este metodo e chamado
  // 1 pega o texto e remove espacos nas pontas com trim
  // 2 se ficar vazio nao faz nada
  //  3 adiciona a mensagem do usuario na lista
  //  4 adiciona uma mensagem  dizendo que o nexus esta digitando
  // 5 depois de um tempo troca pela resposta gerada
  mandarMensagem(): void {
    const texto = this.novaMensagem.trim();
    if (!texto) return;

  // adiciona a mensagem do usuario
  this.mensagem.push({ text: texto, sender: 'usuario' });

    this.novaMensagem = '';

  // adiciona um aviso de digitando
    this.mensagem.push({ 
      text: 'nexus esta digitando', sender: 'nexus', typing: true 

    });

    // depois de um tempo substitui pela resposta final

    setTimeout(() => {
      // remove qualquer mensagem que estava como digitando
      this.mensagem =this.mensagem.filter(m => !m.typing);

      if (texto === this.texto.trim()) {
        // se o texto é igual ao alvo o nexus pergunta e mostra o balao de acoes
  const pergunta = 'O que deseja fazer com o texto?';
  this.mensagem.push({ text: pergunta, sender: 'nexus' });
        this.mensagem.push({ sender: 'nexus', tipo: 'balao-acao', textoAlvo: texto, palavra: '', resumo: '', definicao: '', sinonimos: [] });
      } else {
        const  resposta = this.gerarRespostaAutomatica(texto);
  this.mensagem.push({ text: resposta, sender: 'nexus' });
      }
    }, 50);
  }

  // gera resposta com base em palavras chave do texto
  // tudo em minusculo e sem acentos 
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
        { 

          hour: '2-digit', minute: '2-digit' 
        
        });
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

  
  private salvarPontos(): void {

  }

  private atualizarNivel(): void {
    this.nivel = Math.floor(this.pontos / 100) + 1;
    this.progressoNivel = this.pontos % 100;
  }

  ganharPontos(qtd: number, motivo: string): void {

    if (!qtd) return;
    this.pontos += qtd;
    this.salvarPontos();
    this.atualizarNivel();
    // registra histórico e avisa via badge 
    this.registrarHistorico(qtd, motivo);
    this.notificacaoPontos += qtd; // soma quantidade como contagem

  }

  private registrarHistorico(qtd: number, motivo: string): void {
    const registro = { quando: new Date().toLocaleString('pt-BR'), qtd, motivo };
    this.historicoPontos.unshift(registro);

    // limitar tamanho do histórico
    if (this.historicoPontos.length > 50) this.historicoPontos = this.historicoPontos.slice(0, 50);
  }


  private salvarContadores(): void {
  }

  private salvarConquistas(): void {

  }

  private desbloquearConquista(chave: string, mensagem: string): void {
    const c = this.conquistas.find(cq => cq.chave === chave);
    if (!c || c.desbloqueada) return;
      c.desbloqueada = true;
      c.quando = new Date().toLocaleString('pt-BR');
        this.historicoConquistas.unshift({ quando: c.quando, titulo: c.titulo, mensagem });
    this.notificacaoConquistas += 1;
      this.salvarConquistas();
  }

  private checkConquistas(): void {
    if (this.contResumos >= 1) this.desbloquearConquista('PRIMEIRO_RESUMO', 'Você ganhou a conquista "Primeiro Resumo"!');
    if (this.contResumos >= 10) this.desbloquearConquista('RESUMIDOR_RAPIDO', 'Você ganhou a conquista "Resumidor Rápido" por resumir 10 textos!');
      if (this.contDefinicoes >= 10) this.desbloquearConquista('ESPECIALISTA_DEFINICAO', 'Você ganhou a conquista "Especialista em Definição" por definir 10 palavras!');
  }

  togglePainelConquistas(): void {
    this.showConquistas = !this.showConquistas;
    if (this.showConquistas) this.marcarConquistasComoLidas();


  }

  marcarConquistasComoLidas(): void {
    this.notificacaoConquistas = 0;

    this.salvarConquistas();
  }
  togglePainelPontos(): void {
    this.showPontos = !this.showPontos;
    if (this.showPontos) this.marcarPontosComoLidos();

  }


  marcarPontosComoLidos(): void {
    this.notificacaoPontos = 0;
    
  }


  private closestMsg(node: Node | null): HTMLElement | null {
    let el: Node | null = node;
    while (el && el instanceof HTMLElement === false) el = el.parentNode;
    while (el && el instanceof HTMLElement) {
      const h = el as HTMLElement;

      if (h.classList && (h.classList.contains('usuario') || h.classList.contains('nexus'))) return h;

      el = h.parentElement;


    }
    return null;
  }

  abrirConfiguracao(): void {
    this.router.navigate(['/configuracao']);
  }
}
