import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SucursalActualizarComponent } from './sucursal-actualizar.component';

describe('SucursalActualizarComponent', () => {
  let component: SucursalActualizarComponent;
  let fixture: ComponentFixture<SucursalActualizarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SucursalActualizarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SucursalActualizarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
