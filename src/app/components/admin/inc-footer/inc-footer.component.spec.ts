import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncFooterComponent } from './inc-footer.component';

describe('IncFooterComponent', () => {
  let component: IncFooterComponent;
  let fixture: ComponentFixture<IncFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncFooterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
