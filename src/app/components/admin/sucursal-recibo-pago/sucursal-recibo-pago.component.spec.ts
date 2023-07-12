import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SucursalReciboPagoComponent } from './sucursal-recibo-pago.component';

describe('SucursalReciboPagoComponent', () => {
  let component: SucursalReciboPagoComponent;
  let fixture: ComponentFixture<SucursalReciboPagoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SucursalReciboPagoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SucursalReciboPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
