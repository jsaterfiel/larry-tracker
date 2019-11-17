import Base from './base.js';
import Signals from './signals.js'; // eslint-disable-line

class Ticker extends Base{
  /**
   * 
   * @param {Element} el 
   * @param {string} pcode 
   * @param {string} level1 
   * @param {Window} win
   * @param {Signals} signal
   */
  constructor(el, pcode, level1, win, signal) {
    super(el, pcode, level1, win);

    this._intervalId = null;
    this._signals = signal;
    this._lastTick = false;

    // timers
    this._dwellTime = 0;
    this._halfInViewTime = 0;
    this._eightyPctInViewTime = 0;

    this._tick = this._tick.bind(this);
  }

  start() {
    setInterval(this._tick, 200);
  }

  stop() {
    clearInterval(this._intervalId);
  }

  _tick() {
    let delta = 200;
    let nextTick = Date.now();
    if (this._lastTick > 0) {
      delta = nextTick - this._lastTick;
    }

    //dwell always increments
    this._dwellTime += delta;

    if (this._signals.isHalfInView()) {
      this._halfInViewTime += delta;
    }

    if (this._signals.isEightyPctInView()) {
      this._eightyPctInViewTime += delta;
    }

    this._lastTick = nextTick;
  }

  /**
   * @returns {number}
   */
  getHalfInViewTime() {
    return this._halfInViewTime;
  }

  /**
   * @returns {number}
   */
  getDwellTime() {
    return this._dwellTime;
  }

  /**
   * 80% for 1 second
   * @returns {boolean}
   */
  isDentsuOTS() {
    return this._eightyPctInViewTime >= 1000;
  }
}

export default Ticker;