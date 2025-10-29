// este arquivo inicia o aplicativo angular no navegador
// aqui pegamos a plataforma do navegador e iniciamos o modulo principal do app
// pense como ligar o botao de ligar do app
import { platformBrowser } from '@angular/platform-browser';
import { AppModule } from './app/app-module';

platformBrowser().bootstrapModule(AppModule, {
  
})
  .catch(err => console.error(err));
