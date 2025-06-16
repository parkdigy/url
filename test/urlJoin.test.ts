import { urlJoin } from '../src';

describe('urlJoin', () => {
  it('urlJoin', () => {
    expect(urlJoin('https://domain.com', 'path', 'to')).toBe('https://domain.com/path/to');
    expect(urlJoin('path', 'to')).toBe('path/to');
    expect(urlJoin('path/', '/to')).toBe('path/to');
    expect(urlJoin('path', 'to/')).toBe('path/to/');
  });
});
