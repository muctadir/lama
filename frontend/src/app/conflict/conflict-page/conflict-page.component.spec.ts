import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ConflictPageComponent } from './conflict-page.component';

describe('ConflictPageComponent', () => {
  let component: ConflictPageComponent;
  let fixture: ComponentFixture<ConflictPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConflictPageComponent],
      // Adding the RouterTestingModule dependency
      imports: [RouterTestingModule]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConflictPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Checks whether the component is created successfully
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
