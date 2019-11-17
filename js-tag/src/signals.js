import Base from './base.js';

class Signals extends Base{
  /**
   * 
   * @param {Element} el 
   * @param {string} pcode 
   * @param {string} level1 
   * @param {Window} win 
   */
  constructor(el, pcode, level1, win) {
    super(el, pcode, level1, win);

    this._clicked = false;
    this._interacted = false;
    this._halfInView = false;
    this._wasEverFullyInView = false;
    this._ivt = false;
    this._eightyPctInView = false;
    
    // setup event binds
    this._onClick = this._onClick.bind(this);
    this._onInteraction = this._onInteraction.bind(this);
    this._onViewabilityChange = this._onViewabilityChange.bind(this);
    this._processViewabilityEntry = this._processViewabilityEntry.bind(this);

    // intersection observer setup
    this._observer = new IntersectionObserver(this._onViewabilityChange, {
      rootMargin: '2%', //error margin to handle some padding for the element
      threshold: [0, 0.5, .8, 1]
    });
  }

  addListeners() {
    // setup clicks
    this._el.addEventListener('click', this._onClick, {
      capture: true,
      passive: true
    });

    // setup interactions
    this._el.addEventListener('mouseover', this._onInteraction, {
      capture: true,
      passive: true
    });
    this._el.addEventListener('touchstart', this._onInteraction, {
      capture: true,
      passive: true
    });

    // check if the ad is in view
    this._observer.observe(this._el);
  }

  removeListeners() {
    this._el.removeEventListener('click', this._onClick);
    this._el.removeEventListener('mouseover', this._onInteraction);
    this._el.removeEventListener('touchstart', this._onInteraction);
    this._observer.disconnect();
  }

  _onClick() {
    console.debug('LT:', this._pcode, this._level1, 'clicked');
    this._clicked = true;
  }

  _onInteraction() {
    console.debug('LT:', this._pcode, this._level1, 'interacted');
    this._interacted = true;
  }

  /**
   * @returns {boolean}
   */
  isClicked() {
    return this._clicked;
  }

  /**
   * @returns {boolean}
   */
  isInteracted() {
    return this._interacted;
  }

  /**
   * @returns {boolean}
   */
  isHalfInView() {
    return this._halfInView;
  }

  /**
   * @returns {boolean}
   */
  isEightyPctInView() {
    return this._eightyPctInView;
  }

  _onViewabilityChange(entries) {
    entries.forEach(this._processViewabilityEntry);
  }

  _processViewabilityEntry(entry) {
    if (entry.isIntersecting) {
      // reset to false each check as this is the default state
      this._halfInView = false;
      if (entry.intersectionRatio >= 0.5) {
        this._halfInView = true;

        if (entry.intersectionRatio >= 0.8) {
          this._eightyPctInView = true;
        }

        if (entry.intersectionRatio == 1) {
          this._wasEverFullyInView = true;
        }
      }
      console.debug('LT:', this._pcode, this._level1, '50% in-view', this._halfInView);
      console.debug('LT:', this._pcode, this._level1, '80% in-view', this._halfInView);
    }
  }

  /**
   * @returns {boolean}
   */
  isIVT() {
    if (this._ivt) return true;

    const userAgent = window.navigator.userAgent;
    if (userAgent.indexOf('bot') > -1 || userAgent.indexOf('spider') > -1) {
      this._ivt = true;
    }

    try {
      if(window.document.documentElement.getAttribute('webdriver')) {
        this._ivt = true;
      }
    } catch(Exception) {
      // do nothing
    }
    try {
      if(navigator.webdriver)
        this._ivt = true;
    } catch(Exception){
      // do nothing
    }


    return this._ivt;
  }

  /**
   * @returns {boolean}
   */
  wasEverFullyInView() {
    return this._wasEverFullyInView;
  }
}

export default Signals;