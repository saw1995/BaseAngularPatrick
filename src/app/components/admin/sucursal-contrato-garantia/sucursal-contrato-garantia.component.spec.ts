import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SucursalContratoGarantiaComponent } from './sucursal-contrato-garantia.component';

describe('SucursalContratoGarantiaComponent', () => {
  let component: SucursalContratoGarantiaComponent;
  let fixture: ComponentFixture<SucursalContratoGarantiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SucursalContratoGarantiaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SucursalContratoGarantiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
