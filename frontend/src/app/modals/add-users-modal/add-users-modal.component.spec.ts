import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'app/classes/user';
import { AddUsersModalComponent } from './add-users-modal.component';

/**
 * Test suite for the add users modal
 */
describe('AddUsersModalComponent', () => {
  let component: AddUsersModalComponent;
  let fixture: ComponentFixture<AddUsersModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUsersModalComponent ],
      // Adds NgbActiveModal dependency
      providers: [NgbActiveModal]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUsersModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Checks whether the component is created succesfully
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit addUser event', () => {
    // Creates spy to check whether event is emitted
    let spy = spyOn(component["addUserEvent"], "emit");

    // Dummy input
    let input = new User(5, "test5");

    // Calls the function to be tested
    component.addUser(input);

    // Does checks
    expect(spy).toHaveBeenCalledWith(input);
  });
});
