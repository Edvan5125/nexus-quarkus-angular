import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigComp } from './config-comp';

describe('ConfigComp', () => {
  let component: ConfigComp;
  let fixture: ComponentFixture<ConfigComp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfigComp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigComp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
