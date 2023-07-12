import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CotizacionListaComponent } from './cotizacion-lista.component';

describe('CotizacionListaComponent', () => {
  let component: CotizacionListaComponent;
  let fixture: ComponentFixture<CotizacionListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CotizacionListaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CotizacionListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
