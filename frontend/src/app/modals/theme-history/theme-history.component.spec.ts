import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemeHistoryComponent } from './theme-history.component';

describe('ThemeHistoryComponent', () => {
  let component: ThemeHistoryComponent;
  let fixture: ComponentFixture<ThemeHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThemeHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemeHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
