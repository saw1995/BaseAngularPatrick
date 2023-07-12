import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepuestoListaComponent } from './repuesto-lista.component';

describe('RepuestoListaComponent', () => {
  let component: RepuestoListaComponent;
  let fixture: ComponentFixture<RepuestoListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepuestoListaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RepuestoListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
