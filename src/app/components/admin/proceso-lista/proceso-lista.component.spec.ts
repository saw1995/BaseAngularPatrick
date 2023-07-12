import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcesoListaComponent } from './proceso-lista.component';

describe('ProcesoListaComponent', () => {
  let component: ProcesoListaComponent;
  let fixture: ComponentFixture<ProcesoListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcesoListaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcesoListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
