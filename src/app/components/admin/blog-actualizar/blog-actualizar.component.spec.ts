import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogActualizarComponent } from './blog-actualizar.component';

describe('BlogActualizarComponent', () => {
  let component: BlogActualizarComponent;
  let fixture: ComponentFixture<BlogActualizarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlogActualizarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogActualizarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
