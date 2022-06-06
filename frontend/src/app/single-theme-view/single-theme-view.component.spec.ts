import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';
import { NgbAccordion } from '@ng-bootstrap/ng-bootstrap';

import { SingleThemeViewComponent } from './single-theme-view.component';

describe('SingleThemeViewComponent', () => {
  let component: SingleThemeViewComponent;
  let fixture: ComponentFixture<SingleThemeViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Adding the NgbAccordion dependency, unsure why this needs to be imported for the test case
      declarations: [ SingleThemeViewComponent, NgbAccordion ],
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
