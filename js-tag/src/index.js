import Ad from './ad.js';

/**
 * @type {Array}
 */
const ads = [];

// handle unload for the pixel
window.onbeforeunload = function() {
  //fire unload for all ads
  if (ads) {
    for (let ad of ads) {
      ad.stopTracking();
    }
  }
};

/**
 * track
 * Starts tracking an AD
 * @param {Element} el 
 * @param {string} pcode
 * @param {string} level1
 * @returns {(number|boolean)}
 */
function track(el, pcode, level1) {
  const ad = new Ad(el, pcode, level1, window);
  try {
    ad.startTracking();
  } catch (err) {
    ad.stopTracking();
    return false;
  }
  // returns ad index which will be used to kill the ad manually
  return ads.push(ad) - 1;
}

/**
 * untrack
 * Stops tracking an AD by index
 * @param {number} idx
 */
function untrack(idx) {
  if (!ads[idx]) throw Error('Unable to find ad by id:', idx);
  ads.splice(idx, 1);
}

window['lt'] = {
  'track': track,
  'untrack': untrack
};

export default window['lt'];