import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CotizacionDetalleComponent } from './cotizacion-detalle.component';

describe('CotizacionDetalleComponent', () => {
  let component: CotizacionDetalleComponent;
  let fixture: ComponentFixture<CotizacionDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CotizacionDetalleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CotizacionDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
