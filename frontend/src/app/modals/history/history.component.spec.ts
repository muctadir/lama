import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistoryComponent } from './history.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RouterTestingModule } from '@angular/router/testing';

describe('HistoryComponent', () => {
  let component: HistoryComponent;
  let fixture: ComponentFixture<HistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoryComponent ],
      // Adds NgbActiveModal dependency
      providers: [NgbActiveModal],
      // Adding the RouterTestingModule dependency
      imports: [RouterTestingModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize data correctly', () => {
    // Creates the spy to check whether the function is called
    let spy = spyOn(component, "getHistoryData");

    // Calls the function which we will test
    component.ngOnInit();

    // Does a check
    expect(spy).toHaveBeenCalled();
  });

  it('should initialize data correctly', async () => {
    // Sets some basic value
    component.history_type = "Label";

    // Creates the spy to check whether the function is called
    let spy = spyOn(component["historyService"], "getHistory");

    // Calls the function which we will test
    component.getHistoryData();

    // Does a check
    expect(spy).toHaveBeenCalledWith("Label");
  });
});
