import Ad from '../src/ad.js';
import Singals from '../src/signals.js';

jest.mock('../src/signals.js');
describe('ad.js', () => {
  it('basic', () => {
    const el = document.createElement('div');
    el.height = 200;
    el.width = 200;
    document.body.appendChild(el);
    const ad = new Ad(el, 'client1', '1234', window);
    let msg = false;
    try {
      ad.startTracking();
    } catch(err) {
      msg = err.message;
    }
    expect(msg).toBeFalsy();
    document.body.removeChild(el);
  });

  it('invalid ad dimesions', () => {
    const el = document.createElement('div');
    el.width = 1;
    el.height = 1;
    document.body.appendChild(el);
    const ad = new Ad(el, 'client1', '1234', window);
    let msg = false;
    try {
      ad.startTracking();
    } catch(err) {
      msg = err.message;
    }
    expect(msg).toBe('Invalid Ad dimensions');
    document.body.removeChild(el);
  });
});