import { TestBed } from '@angular/core/testing';
import { ToastCommService } from './toast-comm.service';

/**
 * Test bed for the Toast communication service
 */
describe('ToastCommService', () => {
  let service: ToastCommService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastCommService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit change', () => {
    // Calls the emitChange function with dummy input
    service.emitChange("test");

    // Checks whether the component does crash
    expect(service).toBeTruthy();
  });
});
