import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TelaComp } from './tela-comp';

// este arquivo verifica se o componente telacomp foi criado com sucesso

describe('telacomp', () => {
  let component: TelaComp
  let fixture: ComponentFixture<TelaComp>

  beforeEach(async () => {
    // configura um modulo de teste com o componente
    await TestBed.configureTestingModule({
      // como o componente e standalone nao precisa entrar em declarations
      // mas se fosse necessario, é pra colocar aqui
      declarations: [TelaComp]
    })
    .compileComponents()

    // criar o componente que sera testado
    fixture = TestBed.createComponent(TelaComp)
    component = fixture.componentInstance
    // atualiza o template com os dados iniciais
    fixture.detectChanges()
  })

  it('deve criar o componente', () => {
    // verifica se o componente foi instanciado corretamente
    expect(component).toBeTruthy()
  })
})
