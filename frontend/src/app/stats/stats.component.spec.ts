import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatsDataService } from 'app/services/stats-data.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { StatsComponent } from './stats.component';
import { Project } from 'app/classes/project';

describe('StatsComponent', () => {
  /* Objects to be used in testing */
  // Project id
  const p_id = 5;
  // Project
  const project = new Project(5, "Example", "Tester project")
  // Project data
  const project_data = {
    'project_data': project,
    'conflicts': 10
  };
  // User statistics
  const user_contribution = ['Some', 'Data'];

  let component: StatsComponent;
  let fixture: ComponentFixture<StatsComponent>;

  // Instantiation of StatsDataService
  let statsDataService: StatsDataService;
  // Instantiation of Router
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StatsComponent],
      // Adding the RouterTestingModule dependency
      imports: [RouterTestingModule]
    })
      .compileComponents();
    statsDataService = TestBed.inject(StatsDataService);
    router = TestBed.inject(Router);
    
    // When router.url gets called, return this string
    spyOnProperty(router, 'url', 'get').and.returnValue('/project/5/stats');
    
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Checks whether the component is created successfully
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Checks if ngOnInit works correctly
  it('Tests ngOnInit()', () => {
    // Spy on getProject and getUserStats and stub the calls
    spyOn(component, 'getProject');
    spyOn(component, 'getUserStats');

    // Call the ngOnInit function
    component.ngOnInit();

    // Check that getProject and getUserStats were called
    // with the right parameter
    expect(component.getProject).toHaveBeenCalledWith(p_id);
    expect(component.getUserStats).toHaveBeenCalledWith(p_id);
  });

  // Checks if getProject function works correctly
  it('Tests getProject()', async () => {
    // Return project_data when statsDataService.getProject(p_id) is called
    spyOn(statsDataService, 'getProject').and
      .returnValue(Promise.resolve(project_data));

    // Call the getProject function
    await component.getProject(p_id);

    // Check that statsDataService.getProject(p_id) 
    // was called with the right p_id
    expect(statsDataService.getProject).toHaveBeenCalledWith(p_id);
    // Check that project has the right data
    expect(component.project).toEqual(project_data['project_data'])
    // Check that conflicts has the right data
    expect(component.conflicts).toEqual(project_data['conflicts'])
  });

  // Checks if getUserStats function works correctly
  it('Tests getUserStats()', async () => {
    // Return user_contribution when 
    // statsDataService.getUserStats(p_id) is called
    spyOn(statsDataService, 'getUserStats').and
      .returnValue(Promise.resolve(user_contribution));

    // Call the getUserStats function
    await component.getUserStats(p_id);

    // Check that statsDataService.getUserStats(p_id) 
    // was called with the right p_id
    expect(statsDataService.getUserStats).toHaveBeenCalledWith(p_id);
    // Check that user_contribution has the right data
    expect(component.user_contribution).toEqual(user_contribution)
  });

  it('Tests reRouter()', () => {
    // Spy on router.navigate and stub the call
    spyOn(router, 'navigate');

    // Call the reRoute function
    component.reRouter();

    // Check if reRouter navigates to the labelling page
    expect(router.navigate).toHaveBeenCalledWith(['/project', '5', 'labelling-page']);

  });
});
