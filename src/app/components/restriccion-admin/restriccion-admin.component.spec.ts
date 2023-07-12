import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestriccionAdminComponent } from './restriccion-admin.component';

describe('RestriccionAdminComponent', () => {
  let component: RestriccionAdminComponent;
  let fixture: ComponentFixture<RestriccionAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RestriccionAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RestriccionAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
