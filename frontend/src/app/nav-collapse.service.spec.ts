import { TestBed } from '@angular/core/testing';

import { NavCollapseService } from './nav-collapse.service';

describe('NavCollapseService', () => {
  let service: NavCollapseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NavCollapseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
