import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TallerPagoGeneralComponent } from './taller-pago-general.component';

describe('TallerPagoGeneralComponent', () => {
  let component: TallerPagoGeneralComponent;
  let fixture: ComponentFixture<TallerPagoGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TallerPagoGeneralComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TallerPagoGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
