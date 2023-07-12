import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TallerModuloComponent } from './taller-modulo.component';

describe('TallerModuloComponent', () => {
  let component: TallerModuloComponent;
  let fixture: ComponentFixture<TallerModuloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TallerModuloComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TallerModuloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
