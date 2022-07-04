import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChildrenOutletContexts, RouterModule } from '@angular/router';
import { ProjectComponent } from './project.component';

/**
 * Test bed for the project component
 */
describe('ProjectComponent', () => {
  let component: ProjectComponent;
  let fixture: ComponentFixture<ProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectComponent ],
      imports: [ RouterModule ],
      providers: [ ChildrenOutletContexts ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Checks whether the project component is created successfully
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
