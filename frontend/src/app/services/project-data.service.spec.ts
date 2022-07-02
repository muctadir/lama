import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ProjectDataService } from './project-data.service';
import { Router } from '@angular/router';


describe('ProjectDataService', () => {
  let service: ProjectDataService;
   // Instantiation of Router
   let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule]
    });
    service = TestBed.inject(ProjectDataService);
    router = TestBed.inject(Router)
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
