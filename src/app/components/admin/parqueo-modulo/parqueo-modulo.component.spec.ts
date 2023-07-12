import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParqueoModuloComponent } from './parqueo-modulo.component';

describe('ParqueoModuloComponent', () => {
  let component: ParqueoModuloComponent;
  let fixture: ComponentFixture<ParqueoModuloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParqueoModuloComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParqueoModuloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
