import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TallerVehiculoListaComponent } from './taller-vehiculo-lista.component';

describe('TallerVehiculoListaComponent', () => {
  let component: TallerVehiculoListaComponent;
  let fixture: ComponentFixture<TallerVehiculoListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TallerVehiculoListaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TallerVehiculoListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
