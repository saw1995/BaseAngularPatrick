import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TallerRecepcionAgregarComponent } from './taller-recepcion-agregar.component';

describe('TallerRecepcionAgregarComponent', () => {
  let component: TallerRecepcionAgregarComponent;
  let fixture: ComponentFixture<TallerRecepcionAgregarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TallerRecepcionAgregarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TallerRecepcionAgregarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
