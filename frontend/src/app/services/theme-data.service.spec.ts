import { TestBed } from '@angular/core/testing';
import { Theme } from 'app/classes/theme';

import { ThemeDataService } from './theme-data.service';

describe('ThemeDataService', () => {
  let service: ThemeDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
