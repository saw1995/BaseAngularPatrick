import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogAgregarComponent } from './blog-agregar.component';

describe('BlogAgregarComponent', () => {
  let component: BlogAgregarComponent;
  let fixture: ComponentFixture<BlogAgregarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlogAgregarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogAgregarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
