class Base {
  /**
   * 
   * @param {Element} el 
   * @param {string} pcode 
   * @param {string} level1 
   * @param {Window} win 
   */
  constructor(el, pcode, level1, win) {
    this._el = el;
    this._pcode = pcode;
    this._level1 = level1;
    this._win = win;
  }
}

export default Base;