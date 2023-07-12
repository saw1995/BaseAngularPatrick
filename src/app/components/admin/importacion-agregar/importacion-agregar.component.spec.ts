import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportacionAgregarComponent } from './importacion-agregar.component';

describe('ImportacionAgregarComponent', () => {
  let component: ImportacionAgregarComponent;
  let fixture: ComponentFixture<ImportacionAgregarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportacionAgregarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportacionAgregarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
