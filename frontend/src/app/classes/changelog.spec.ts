import { Changelog } from './changelog';

describe('Changelog', () => {
  it('should create an instance', () => {
    expect(new Changelog("a", "b", "c")).toBeTruthy();
  });
});
