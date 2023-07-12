import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TallerListaComponent } from './taller-lista.component';

describe('TallerListaComponent', () => {
  let component: TallerListaComponent;
  let fixture: ComponentFixture<TallerListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TallerListaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TallerListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
