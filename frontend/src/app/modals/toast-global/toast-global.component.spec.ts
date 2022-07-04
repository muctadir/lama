import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastGlobalComponent } from 'app/modals/toast-global/toast-global.component';

/**
 * Testing suite for the toast component
 */
describe('ToastGlobalComponent', () => {
  let component: ToastGlobalComponent;
  let fixture: ComponentFixture<ToastGlobalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToastGlobalComponent ],
      imports: [ NgbToastModule ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToastGlobalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should destroy the subscription', () => {
    // Creates the spy for the function call we are making
    let spy = spyOn(component["toastService"], "clear");

    // Calls function
    component.ngOnDestroy();

    // Does the final checks
    expect(spy).toHaveBeenCalled();
  });

  it('should test the subscription', () => {
    // Creates the spy
    let spy = spyOn(component["toastService"], "show");

    // Emits a toast
    component["toastCommService"].emitChange([false, "error"]);

    // Checks whether toast was made
    expect(spy).toHaveBeenCalled();
  });

  it('should test the subscription case 2', () => {
    // Creates the spy
    let spy = spyOn(component["toastService"], "show");

    // Emits a toast
    component["toastCommService"].emitChange([true, "no error"]);

    // Checks whether toast was made
    expect(spy).toHaveBeenCalled();
  });

});
