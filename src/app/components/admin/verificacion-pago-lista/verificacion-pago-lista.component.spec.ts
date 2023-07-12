import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificacionPagoListaComponent } from './verificacion-pago-lista.component';

describe('VerificacionPagoListaComponent', () => {
  let component: VerificacionPagoListaComponent;
  let fixture: ComponentFixture<VerificacionPagoListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerificacionPagoListaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerificacionPagoListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
