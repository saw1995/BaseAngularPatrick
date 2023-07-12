import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SucursalModuloComponent } from './sucursal-modulo.component';

describe('SucursalModuloComponent', () => {
  let component: SucursalModuloComponent;
  let fixture: ComponentFixture<SucursalModuloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SucursalModuloComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SucursalModuloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
