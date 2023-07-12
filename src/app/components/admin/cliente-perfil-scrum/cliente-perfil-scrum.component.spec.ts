import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientePerfilScrumComponent } from './cliente-perfil-scrum.component';

describe('ClientePerfilScrumComponent', () => {
  let component: ClientePerfilScrumComponent;
  let fixture: ComponentFixture<ClientePerfilScrumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientePerfilScrumComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientePerfilScrumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
