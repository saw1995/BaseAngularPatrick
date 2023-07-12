import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepuestoFisicoListaComponent } from './repuesto-fisico-lista.component';

describe('RepuestoFisicoListaComponent', () => {
  let component: RepuestoFisicoListaComponent;
  let fixture: ComponentFixture<RepuestoFisicoListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepuestoFisicoListaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RepuestoFisicoListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
