import Base from './base.js';
import Signals from './signals.js';
import Ticker from './ticker.js';
import Pixel from './pixel.js';

class Ad extends Base{
  /**
   * 
   * @param {Element} el 
   * @param {string} pcode 
   * @param {string} level1 
   * @param {Window} win 
   */
  constructor(el, pcode, level1, win) {
    super(el, pcode, level1, win);
    this._signals = new Signals(el, pcode, level1, win);
    this._ticker = new Ticker(el, pcode, level1, win, this._signals);
    
    // these values uniquely identifies an impression
    this._startTime = Date.now();
    this._rand = Math.floor(Math.random() * 100000000000000000);
    this._maxloops = 20;

    this._pixel = new Pixel(el, pcode, level1, win, this._signals, this._ticker, this._startTime, this._rand);

    //binds
    this.startTracking = this.startTracking.bind(this);
  }

  startTracking() {
    // check ad valid size
    if (!this._el || this._el.height < 25 || this._el.width < 25) {
      if (this._maxloops) {
        --this._maxloops;
      } else {
        console.debug('LT:', this._pcode, this._level1, 'unable to track');
        return;
      }
      setTimeout(this.startTracking, 100);
      return;
    }
    console.debug('LT:', this._pcode, this._level1, 'startTracking');

    this._signals.addListeners();
    this._ticker.start();

    this._pixel.fire();
  }

  stopTracking() {
    console.debug('LT:', this._pcode, this._level1, 'stopTracking');
    this._signals.removeListeners();
    this._ticker.stop();
    this._pixel.fire();
  }
}

export default Ad;