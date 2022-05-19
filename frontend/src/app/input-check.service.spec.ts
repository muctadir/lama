import { TestBed } from '@angular/core/testing';

import { InputCheckService } from './input-check.service';

describe('InputCheckService', () => {
  let service: InputCheckService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InputCheckService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
