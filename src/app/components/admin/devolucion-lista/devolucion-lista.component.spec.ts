import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevolucionListaComponent } from './devolucion-lista.component';

describe('DevolucionListaComponent', () => {
  let component: DevolucionListaComponent;
  let fixture: ComponentFixture<DevolucionListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DevolucionListaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DevolucionListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
