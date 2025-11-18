import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroComp } from './cadastro-comp';

describe('CadastroComp', () => {
  let component: CadastroComp;
  let fixture: ComponentFixture<CadastroComp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CadastroComp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastroComp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
