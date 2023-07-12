import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcesoModeloComponent } from './proceso-modelo.component';

describe('ProcesoModeloComponent', () => {
  let component: ProcesoModeloComponent;
  let fixture: ComponentFixture<ProcesoModeloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcesoModeloComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcesoModeloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
