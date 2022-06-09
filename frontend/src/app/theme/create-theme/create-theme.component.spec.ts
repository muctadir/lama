import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';

import { CreateThemeComponent } from './create-theme.component';

describe('CreateThemeComponent', () => {
  let component: CreateThemeComponent;
  let fixture: ComponentFixture<CreateThemeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateThemeComponent ],
      // Adding the RouterTestingModule dependency
      imports: [RouterTestingModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateThemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Checks whether the component is created successfully
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
