import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteAdendaEditarComponent } from './cliente-adenda-editar.component';

describe('ClienteAdendaEditarComponent', () => {
  let component: ClienteAdendaEditarComponent;
  let fixture: ComponentFixture<ClienteAdendaEditarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClienteAdendaEditarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClienteAdendaEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
