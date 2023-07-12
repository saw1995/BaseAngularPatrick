import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportacionDetalleComponent } from './importacion-detalle.component';

describe('ImportacionDetalleComponent', () => {
  let component: ImportacionDetalleComponent;
  let fixture: ComponentFixture<ImportacionDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportacionDetalleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportacionDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
