import Ticker from '../src/ticker.js';

describe('ticker.js', () => {
  it('tick checker fully in-view', done => {
    const el = document.createElement('div');
    let halfInView = true;
    const fakeSignal = {
      isHalfInView: () => {
        return halfInView;
      },

      isEightyPctInView: () => {
        return true;
      }
    };
    const ticker = new Ticker(el,'client1', '12345', window, fakeSignal);

    const originalInterval = window.setInterval;
    window.setInterval = function(handler, timeout) {
      handler();
      expect(timeout).toBe(200);
      expect(ticker.getDwellTime()).toBeGreaterThan(0);
      expect(ticker.getHalfInViewTime()).toBeGreaterThan(0);
      done();

      //clean up
      window.setInterval = originalInterval;
      return 1;
    };

    ticker.start();
  });

  it('tick checker half in-view', done => {
    const el = document.createElement('div');
    let halfInView = true;
    const fakeSignal = {
      isHalfInView: () => {
        return halfInView;
      },

      isEightyPctInView: () => {
        return true;
      }
    };
    const ticker = new Ticker(el,'client1', '12345', window, fakeSignal);

    const originalInterval = window.setInterval;
    window.setInterval = function(handler, timeout) {
      handler();
      expect(timeout).toBe(200);
      expect(ticker.getDwellTime()).toBeGreaterThan(0);
      expect(ticker.getHalfInViewTime()).toBeGreaterThan(0);
      done();

      //clean up
      window.setInterval = originalInterval;
      return 1;
    };

    ticker.start();
  });

  it('tick checker not in-view', done => {
    const el = document.createElement('div');
    let halfInView = false;
    const fakeSignal = {
      isHalfInView: () => {
        return halfInView;
      },

      isEightyPctInView: () => {
        return true;
      }
    };
    const ticker = new Ticker(el,'client1', '12345', window, fakeSignal);

    const originalInterval = window.setInterval;
    window.setInterval = function(handler, timeout) {
      handler();
      expect(timeout).toBe(200);
      expect(ticker.getDwellTime()).toBeGreaterThan(0);
      expect(ticker.getHalfInViewTime()).toBe(0);
      done();

      //clean up
      window.setInterval = originalInterval;
      return 1;
    };

    ticker.start();
  });
});