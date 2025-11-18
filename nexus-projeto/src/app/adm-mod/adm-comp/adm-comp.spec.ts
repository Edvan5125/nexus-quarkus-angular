import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmComp } from './adm-comp';

describe('AdmComp', () => {
  let component: AdmComp;
  let fixture: ComponentFixture<AdmComp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdmComp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdmComp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
