import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecepcionAgregarComponent } from './recepcion-agregar.component';

describe('RecepcionAgregarComponent', () => {
  let component: RecepcionAgregarComponent;
  let fixture: ComponentFixture<RecepcionAgregarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecepcionAgregarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecepcionAgregarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
