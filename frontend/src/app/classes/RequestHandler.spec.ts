import { RequestHandler } from './RequestHandler';

describe('RequestHandler', () => {
  it('Should create an instance without a session variable', () => {
    expect(new RequestHandler()).toBeTruthy();
  });

  it('Should create an instance with a session variable', () => {
    expect(new RequestHandler("")).toBeTruthy();
  })
});
