import Pixel from '../src/pixel.js';

describe('pixel.js', () => {
  it('fire pixel', done => {
    const el = document.createElement('div');
    const fakeSignal = {
      isIVT: () => {
        return true;
      },

      isClicked: () => {
        return true;
      },

      isInteracted: () => {
        return true;
      },

      wasEverFullyInView: () => {
        return true;
      }
    };
    const fakeTicker = {
      getDwellTime: () => {
        return 200;
      },

      getHalfInViewTime: () => {
        return 200;
      },

      isDentsuOTS: () => {
        return true;
      }
    };
    const pixel = new Pixel(el, 'client1', '12345', window, fakeSignal, fakeTicker, 44444444444, 111111111111);

    //saving so it can be restored after the test
    const originalSendBeacon = window.navigator.sendBeacon;
    
    window.navigator.sendBeacon = url => {
      expect(url).toBe('http://localhost:8181/api/collection?pcode=client1&level1=12345&hw=44444444444&ord=111111111111&ba=1&ac=200&ct=200&gs=1&ef=1&fa=1&rt=1');

      //clean up
      window.navigator.sendBeacon = originalSendBeacon;
      done();
    }
    pixel.fire();
  });
});