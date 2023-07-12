import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecepcionListaComponent } from './recepcion-lista.component';

describe('RecepcionListaComponent', () => {
  let component: RecepcionListaComponent;
  let fixture: ComponentFixture<RecepcionListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecepcionListaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecepcionListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
