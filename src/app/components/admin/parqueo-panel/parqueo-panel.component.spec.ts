import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParqueoPanelComponent } from './parqueo-panel.component';

describe('ParqueoPanelComponent', () => {
  let component: ParqueoPanelComponent;
  let fixture: ComponentFixture<ParqueoPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParqueoPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParqueoPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
