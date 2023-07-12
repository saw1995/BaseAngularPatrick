import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncHeaderComponent } from './inc-header.component';

describe('IncHeaderComponent', () => {
  let component: IncHeaderComponent;
  let fixture: ComponentFixture<IncHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
