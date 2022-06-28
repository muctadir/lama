import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConflictResolutionComponent } from './conflict-resolution.component';

describe('ConflictResolutionComponent', () => {
  let component: ConflictResolutionComponent;
  let fixture: ComponentFixture<ConflictResolutionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConflictResolutionComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConflictResolutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
