import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogListaComponent } from './blog-lista.component';

describe('BlogListaComponent', () => {
  let component: BlogListaComponent;
  let fixture: ComponentFixture<BlogListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlogListaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
