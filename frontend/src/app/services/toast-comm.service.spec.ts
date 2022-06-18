import { TestBed } from '@angular/core/testing';

import { ToastCommService } from './toast-comm.service';

describe('ToastCommService', () => {
  let service: ToastCommService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastCommService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
