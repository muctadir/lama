import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IndividualLabelComponent } from './individual-label.component';

describe('IndividualLabelComponent', () => {
  let component: IndividualLabelComponent;
  let fixture: ComponentFixture<IndividualLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndividualLabelComponent ],
      // Addis RouterTestingModule dependency
      imports: [RouterTestingModule],
      // Adds NgbActiveModal dependency
      providers: [NgbActiveModal]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Checks whether the component is created correctly
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
