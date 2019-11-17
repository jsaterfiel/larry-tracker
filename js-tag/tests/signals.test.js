import Signals from '../src/signals.js';

global.IntersectionObserver = class IntersectionObserver {
  constructor() {}

  observe() {
    return null;
  }

  disconnect() {
    return null;
  }

  unobserve() {
    return null;
  }
};

describe('signals.js', () => {
  it('can be clicked', done => {
    const el = document.createElement('img');
    const signal = new Signals(el, 'client1', '1234', window);
    signal.addListeners();
    const checker = () => {
      signal.removeListeners();
      expect(signal.isClicked()).toBe(true);
      done();
      el.removeEventListener('click', checker);
    };
    el.addEventListener('click', checker);
    el.click();
  });

  it('in-view check', () => {
    const el = document.createElement('div');
    el.id = 'ad';
    el.style.cssText = 'width: 200px; height: 200px;';
    document.body.appendChild(el);
    const signal = new Signals(el, 'client1', '1234', window);
    signal.addListeners();
    const entries = [
      {
        isIntersecting: true,
        target: el,
        intersectionRatio: .85
      }
    ];
    signal._onViewabilityChange(entries);
    signal.removeListeners();
  });
});