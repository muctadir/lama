import { Theme } from './theme';

describe('Theme', () => {
  it('should create an instance', () => {
    expect(new Theme("Test", "Test")).toBeTruthy();
  });
});
