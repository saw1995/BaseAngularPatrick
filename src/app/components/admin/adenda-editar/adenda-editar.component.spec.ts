import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdendaEditarComponent } from './adenda-editar.component';

describe('AdendaEditarComponent', () => {
  let component: AdendaEditarComponent;
  let fixture: ComponentFixture<AdendaEditarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdendaEditarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdendaEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
