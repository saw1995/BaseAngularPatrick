import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParqueoSalidasComponent } from './parqueo-salidas.component';

describe('ParqueoSalidasComponent', () => {
  let component: ParqueoSalidasComponent;
  let fixture: ComponentFixture<ParqueoSalidasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParqueoSalidasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParqueoSalidasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
