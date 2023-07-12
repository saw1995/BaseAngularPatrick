import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagenViewComponent } from './imagen-view.component';

describe('ImagenViewComponent', () => {
  let component: ImagenViewComponent;
  let fixture: ComponentFixture<ImagenViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImagenViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImagenViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
