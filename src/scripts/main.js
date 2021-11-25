// NOTE: main.js is called at the end of the document body - no DOMContentLoaded event needed
import setActiveTrail from './modules/set-active-trail';
import loadResponsiveImage from './modules/load-responsive-image';

(function() {
  setActiveTrail();
  loadResponsiveImage();
})();
