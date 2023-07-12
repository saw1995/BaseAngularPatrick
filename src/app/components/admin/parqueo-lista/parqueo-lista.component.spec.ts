import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParqueoListaComponent } from './parqueo-lista.component';

describe('ParqueoListaComponent', () => {
  let component: ParqueoListaComponent;
  let fixture: ComponentFixture<ParqueoListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParqueoListaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParqueoListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
