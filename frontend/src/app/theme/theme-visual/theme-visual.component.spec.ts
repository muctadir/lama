import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemeVisualComponent } from './theme-visual.component';

describe('ThemeVisualComponent', () => {
  let component: ThemeVisualComponent;
  let fixture: ComponentFixture<ThemeVisualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThemeVisualComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemeVisualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
