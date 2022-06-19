import { TestBed } from '@angular/core/testing';

import { AccountInfoService } from './account-info.service';

describe('AccountInfoService', () => {
  let service: AccountInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccountInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
