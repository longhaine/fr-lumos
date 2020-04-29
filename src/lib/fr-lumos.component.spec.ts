import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrLumos } from './fr-lumos.component';

describe('FrLumos', () => {
  let component: FrLumos;
  let fixture: ComponentFixture<FrLumos>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrLumos ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrLumos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
