import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TallerRecepcionImportacionComponent } from './taller-recepcion-importacion.component';

describe('TallerRecepcionImportacionComponent', () => {
  let component: TallerRecepcionImportacionComponent;
  let fixture: ComponentFixture<TallerRecepcionImportacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TallerRecepcionImportacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TallerRecepcionImportacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
