import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportacionListaComponent } from './importacion-lista.component';

describe('ImportacionListaComponent', () => {
  let component: ImportacionListaComponent;
  let fixture: ComponentFixture<ImportacionListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportacionListaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportacionListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
