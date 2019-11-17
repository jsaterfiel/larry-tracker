import Ad from '../src/ad.js';
import lt from '../src/index.js';

jest.mock('../src/ad.js');

describe('index.js', () => {
  it('window track setup', () => {
    const el = document.createElement('img');
    let idx = lt.track(el, 'client1', '1234');
    expect(idx).toBe(0);
    lt.untrack(idx);

    idx = lt.track(el, 'client1', '1234');
    expect(idx).toBe(0);
    lt.untrack(idx);
  });
});
