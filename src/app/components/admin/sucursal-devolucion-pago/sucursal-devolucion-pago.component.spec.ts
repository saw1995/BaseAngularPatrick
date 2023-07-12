import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SucursalDevolucionPagoComponent } from './sucursal-devolucion-pago.component';

describe('SucursalDevolucionPagoComponent', () => {
  let component: SucursalDevolucionPagoComponent;
  let fixture: ComponentFixture<SucursalDevolucionPagoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SucursalDevolucionPagoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SucursalDevolucionPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
