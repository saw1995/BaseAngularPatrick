import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehiculoAgregarExhibicionComponent } from './vehiculo-agregar-exhibicion.component';

describe('VehiculoAgregarExhibicionComponent', () => {
  let component: VehiculoAgregarExhibicionComponent;
  let fixture: ComponentFixture<VehiculoAgregarExhibicionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehiculoAgregarExhibicionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VehiculoAgregarExhibicionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
