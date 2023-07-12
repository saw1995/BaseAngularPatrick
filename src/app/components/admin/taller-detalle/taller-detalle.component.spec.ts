import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TallerDetalleComponent } from './taller-detalle.component';

describe('TallerDetalleComponent', () => {
  let component: TallerDetalleComponent;
  let fixture: ComponentFixture<TallerDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TallerDetalleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TallerDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
