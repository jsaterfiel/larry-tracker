(function(){
  var pcode = 'client_1';
  var adIds = [];
  document.querySelectorAll('.adSlot').forEach( function(el, idx) {
    console.log('AD SLOT:', idx, el);
    if (!el.children) {
      console.log('AD SLOT:', 'No child element found for slot');
      return;
    }
    var level1 = el.getAttribute('data-ad-level1');
    if (!level1) {
      console.log('AD SLOT:', 'No child element found for slot');
      return;
    }
    var result = window['lt'].track(el.children[0], pcode, level1);
    if (result === false) {
      console.warn('AD SLOT:', 'Unable to track ad', pcode, level1);
      return;
    }
    adIds.push(result);
  });
})();