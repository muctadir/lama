import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AccountInformationComponent } from './account-information.component';

/**
 * Test suite for the AccountInformationComponent
 * 
 * Does not contain any TS functions, so no tests aside from the basic one are provided
 */
describe('AccountInformationComponent', () => {
  let component: AccountInformationComponent;
  let fixture: ComponentFixture<AccountInformationComponent>;

  /**
   * Executed before every test, no additional dependencies have to be added
   */
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountInformationComponent],
      imports: [RouterTestingModule]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Only test case that exists, checks whether the component is created correctly
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});