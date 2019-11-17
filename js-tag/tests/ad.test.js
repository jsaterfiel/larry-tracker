import Ad from '../src/ad.js';
import Singals from '../src/signals.js';
import Pixel from '../src/pixel.js';
import Ticker from '../src/ticker.js';

jest.mock('../src/signals.js');
jest.mock('../src/pixel.js');
jest.mock('../src/ticker.js');

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

  it('invalid ad dimesions', done => {
    // test harness for detecting if we've not found a valid ad and are looping to wait for an ad
    // will restore the function once we're done testing
    const originalTimeout = window.setTimeout;
    let timeoutCalled = false;
    window.setTimeout = function(handler, timeout) {
      timeoutCalled = timeout;

      expect(timeoutCalled).toBe(100);

      window.setTimeout = originalTimeout;
      document.body.removeChild(el);
      done();
    };
    const el = document.createElement('div');
    el.width = 1;
    el.height = 1;
    document.body.appendChild(el);
    const ad = new Ad(el, 'client1', '1234', window);
    ad.startTracking();
  });
});