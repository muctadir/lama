import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ConflictPageComponent } from './conflict-page.component';

/**
 * Test bed for conflict page component
 */
describe('ConflictPageComponent', () => {
  let component: ConflictPageComponent;
  let fixture: ComponentFixture<ConflictPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConflictPageComponent ],
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

  it('should initialize correctly', () => {
    // spies on the url
    spyOnProperty(component["router"], "url", "get").and.returnValue("/project/5/conflict-page/6");

    // spy for the requestConflict call
    let spy = spyOn(component, "requestConflicts")

    // calls the function to be tested
    component.ngOnInit();

    // Checks whether requestConflict was called correctly
    expect(spy).toHaveBeenCalledWith(5);
  });

  it('should reroute to a conflict', () => {
    // spies on the url
    spyOnProperty(component["router"], "url", "get").and.returnValue("/project/5/conflict-page/6");

    // spy for the router navigate call
    let spyRouter = spyOn(component["router"], "navigate");

    // calls the function to be tested
    component.reRouter(1,2,"a");

    // Checks whether requestConflict was called correctly
    expect(spyRouter).toHaveBeenCalledWith(['/project', '5', 'conflictResolution', 1, 2, "a" ]);
  });

  it('should request the conflicts', async () => {
    // Creates spy for the backend call
    let spy = spyOn(component["conflictDataService"], "getConflicts").and.returnValue(Promise.resolve([]));
    // Spy for the router navigate call
    let spyRouter = spyOn(component["router"], "navigate");
    // Spy for the toasts
    let spyToast = spyOn(component["toastCommService"], "emitChange");

    // Calls the function to be tested
    await component.requestConflicts(8);

    // Does the checks
    expect(spy).toHaveBeenCalled();
    expect(spyRouter).toHaveBeenCalledWith(['/project', 8, 'stats']);
    expect(spyToast).toHaveBeenCalledWith([true, "There are no conflicts"]);
  });

  it('should request the conflicts', async () => {
    // Creates spy for the backend call
    let spy = spyOn(component["conflictDataService"], "getConflicts").and.returnValue(Promise.resolve([{
      "conflict": "a"
    }]));

    // Calls the function to be tested
    await component.requestConflicts(8);

    // Does the checks
    expect(spy).toHaveBeenCalled();
    expect(component.conflicts).toEqual([{"conflict": "a"}]);
  });
});
