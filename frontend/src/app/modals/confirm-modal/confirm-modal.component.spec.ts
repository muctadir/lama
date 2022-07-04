import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModalComponent } from './confirm-modal.component';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('ConfirmModalComponent', () => {
  let component: ConfirmModalComponent;
  let fixture: ComponentFixture<ConfirmModalComponent>;
  let router: Router

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmModalComponent ],
      providers: [ NgbModal, NgbActiveModal],
      imports: [RouterTestingModule]
    })
    .compileComponents();
    router = TestBed.inject(Router)
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call the functions in the confirm method', () => {
    // Creates the spies
    let spy = spyOn(component["confirmEvent"], "emit");
    let spy2 = spyOn(component["activeModal"], "close");

    // Calls the function which we want to test
    component.confirm();

    // Checks whether the correct functions are called
    expect(spy).toHaveBeenCalledWith(true);
    expect(spy2).toHaveBeenCalled();
  });
});
