import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TelaComp } from './tela-comp';

describe('telacomp', () => {
  let component: TelaComp
  let fixture: ComponentFixture<TelaComp>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TelaComp]
    })
    .compileComponents()
    fixture = TestBed.createComponent(TelaComp)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
