import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParqueoEntradasComponent } from './parqueo-entradas.component';

describe('ParqueoEntradasComponent', () => {
  let component: ParqueoEntradasComponent;
  let fixture: ComponentFixture<ParqueoEntradasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParqueoEntradasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParqueoEntradasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
