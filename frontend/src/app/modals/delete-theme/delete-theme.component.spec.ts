import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { DeleteThemeComponent } from './delete-theme.component';

describe('DeleteThemeComponent', () => {
  let component: DeleteThemeComponent;
  let fixture: ComponentFixture<DeleteThemeComponent>;
  let router: Router;
  let activeModal: NgbActiveModal

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Adds the RouterTestingModule dependency
      imports: [RouterTestingModule],
      declarations: [ DeleteThemeComponent ],
      // Adds NgbActiveModal dependency
      providers: [NgbActiveModal]
    })
    .compileComponents();
    fixture = TestBed.createComponent(DeleteThemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router = TestBed.inject(Router);
    activeModal = TestBed.inject(NgbActiveModal)
  });

  // Create components
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test for deleteTheme function
  it('Test deleteTheme function', async () => {
    // Spy on the request handler call
    let spy1 = spyOn(component['themeDataService'], "delete_theme");
    let spy2 = spyOn(router, "navigate");
    let spy3 = spyOn(activeModal, "close");
    // Call the function
    await component.deleteTheme();
    // Test if the function was called
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
  });
});
