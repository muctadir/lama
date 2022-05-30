import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConflictPageComponent } from './conflict-page.component';

describe('ConflictPageComponent', () => {
  let component: ConflictPageComponent;
  let fixture: ComponentFixture<ConflictPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConflictPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConflictPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
