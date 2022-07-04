import { TestBed } from '@angular/core/testing';

import { InputCheckService } from './input-check.service';

describe('InputCheckService', () => {
  let service: InputCheckService;

  // Initializes the InputCheckService
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InputCheckService);
  });

  // Checks whether the service gets created correctly
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Checks whether checkfilled returns false when input is empty
  it('should return false when input is empty', () => {
    expect(service.checkFilled("")).toBe(false);
  });

  // Checks whether checkfilled returns true when input is non-empty
  it('should return true when input is non-empty', () => {
    expect(service.checkFilled("test")).toBe(true);
  });

  // Checks whether checkEmail returns true when input is valid email
  it('should return true when input is valid email', () => {
    expect(service.checkEmail("test@gmail.com")).toBe(true);
  });

  // Checks whether checkEmail returns false when email doesnt have the @x.y
  it('should return false when input doesnt have @x.y', () => {
    expect(service.checkEmail("test")).toBe(false);
  });

  // Checks whether checkEmail returns false when top-level domain is < 2 letters
  it('should return false when top-level domain is < 2 letters', () => {
    expect(service.checkEmail("test@gmail.x")).toBe(false);
  });

  // Checks whether checkEmail returns false when top-level domain is > 3 letters
  it('should return false when top-level domain is > 3 letters', () => {
    expect(service.checkEmail("test@gmail.testers")).toBe(false);
  });

  // Checks whether checkEmail returns false when there are 2 addresses.
  it('should return false when there are 2 addresses.', () => {
    expect(service.checkEmail("test@gmail.com@hotmail.com")).toBe(false);
  });

});
