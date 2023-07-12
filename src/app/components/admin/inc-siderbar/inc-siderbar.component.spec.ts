import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncSiderbarComponent } from './inc-siderbar.component';

describe('IncSiderbarComponent', () => {
  let component: IncSiderbarComponent;
  let fixture: ComponentFixture<IncSiderbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncSiderbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncSiderbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
