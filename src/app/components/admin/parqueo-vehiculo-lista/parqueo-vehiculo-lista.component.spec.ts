import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParqueoVehiculoListaComponent } from './parqueo-vehiculo-lista.component';

describe('ParqueoVehiculoListaComponent', () => {
  let component: ParqueoVehiculoListaComponent;
  let fixture: ComponentFixture<ParqueoVehiculoListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParqueoVehiculoListaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParqueoVehiculoListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
