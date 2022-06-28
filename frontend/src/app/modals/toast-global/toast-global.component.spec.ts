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
      imports: [NgbToastModule]
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
    // creates the spy for the function call we are making
    let spy = spyOn(component["toastService"], "clear");

    // calls function
    component.ngOnDestroy();

    // Does the final checks
    expect(spy).toHaveBeenCalled();
  });

});
