import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwInicioComponent } from './sw-inicio.component';

describe('SwInicioComponent', () => {
  let component: SwInicioComponent;
  let fixture: ComponentFixture<SwInicioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SwInicioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SwInicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
