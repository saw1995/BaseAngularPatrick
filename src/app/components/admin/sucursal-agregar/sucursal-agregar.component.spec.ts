import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SucursalAgregarComponent } from './sucursal-agregar.component';

describe('SucursalAgregarComponent', () => {
  let component: SucursalAgregarComponent;
  let fixture: ComponentFixture<SucursalAgregarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SucursalAgregarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SucursalAgregarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
