import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrumListaComponent } from './scrum-lista.component';

describe('ScrumListaComponent', () => {
  let component: ScrumListaComponent;
  let fixture: ComponentFixture<ScrumListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScrumListaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScrumListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
