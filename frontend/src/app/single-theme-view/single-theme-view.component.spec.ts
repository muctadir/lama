import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';

import { SingleThemeViewComponent } from './single-theme-view.component';

describe('SingleThemeViewComponent', () => {
  let component: SingleThemeViewComponent;
  let fixture: ComponentFixture<SingleThemeViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleThemeViewComponent ],
      // Adding the RouterTestingModule dependency
      imports: [RouterTestingModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleThemeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
