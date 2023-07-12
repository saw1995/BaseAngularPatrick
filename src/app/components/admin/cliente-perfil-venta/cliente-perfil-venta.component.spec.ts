import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientePerfilVentaComponent } from './cliente-perfil-venta.component';

describe('ClientePerfilVentaComponent', () => {
  let component: ClientePerfilVentaComponent;
  let fixture: ComponentFixture<ClientePerfilVentaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientePerfilVentaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientePerfilVentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
