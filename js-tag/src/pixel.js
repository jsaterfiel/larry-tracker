import Base from './base.js';
import Signals from './signals.js'; // eslint-disable-line
import Ticker from './ticker.js'; // eslint-disable-line

class Pixel extends Base{
  /**
   * 
   * @param {Element} el 
   * @param {string} pcode 
   * @param {string} level1 
   * @param {Window} win
   * @param {Signals} signal
   * @param {Ticker} ticker
   * @param {Date} startTime
   * @param {number} rand
   */
  constructor(el, pcode, level1, win, signal, ticker, startTime, rand) {
    super(el, pcode, level1, win);

    this._signals = signal;
    this._ticker = ticker;
    this._startTime = startTime;
    this._rand = rand;
  }

  fire() {
    console.debug('LT:', this._pcode, this._level1, 'fire pixel');

    // TODO: add interactions
    // TODO: add ticker to track was ever fully in view
    // TODO: add ticket to track if dentsu OTS
    const params = {
      'pcode': this._pcode,
      'level1': this._level1,
      'hw': this._startTime.getTime(),
      'fc': this._startTime.getFullYear() + '-' + (this._startTime.getMonth()+1) + '-' + (this._startTime.getDate()),
      'ord': this._rand,
      'ba': this._ticker.isDentsuOTS(),
      'ac': this._ticker.getDwellTime(),
      'ct': this._ticker.getHalfInViewTime(),
      'gs': this._signals.isClicked(),
      'ef': this._signals.isInteracted(),
      'fa': this._signals.wasEverFullyInView(),
      'rt': this._signals.isIVT()
    };

    const baseURL = 'http://localhost:8181/api/collection?';
    let queryString = '';
    let param;
    for(let index of Object.keys(params)) {
      param = params[index];
      if (typeof param == 'boolean') {
        param = (param ? 1: 0);
      }
      if (queryString) {
        queryString += '&';
      }
      queryString += encodeURIComponent(index) + '=' + encodeURIComponent(param);
    }
    window.navigator.sendBeacon(baseURL + queryString);
  }
}

export default Pixel;