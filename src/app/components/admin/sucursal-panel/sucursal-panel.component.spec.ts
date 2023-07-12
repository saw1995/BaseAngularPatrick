import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SucursalPanelComponent } from './sucursal-panel.component';

describe('SucursalPanelComponent', () => {
  let component: SucursalPanelComponent;
  let fixture: ComponentFixture<SucursalPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SucursalPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SucursalPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
