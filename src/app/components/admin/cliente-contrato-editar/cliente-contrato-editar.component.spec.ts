import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteContratoEditarComponent } from './cliente-contrato-editar.component';

describe('ClienteContratoEditarComponent', () => {
  let component: ClienteContratoEditarComponent;
  let fixture: ComponentFixture<ClienteContratoEditarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClienteContratoEditarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClienteContratoEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
