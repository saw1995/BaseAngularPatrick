import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GastoListaComponent } from './gasto-lista.component';

describe('GastoListaComponent', () => {
  let component: GastoListaComponent;
  let fixture: ComponentFixture<GastoListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GastoListaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GastoListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
