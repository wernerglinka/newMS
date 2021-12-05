// NOTE: main.js is called at the end of the document body - no DOMContentLoaded event needed
import loadResponsiveImage from './modules/load-responsive-image';
import hamburger from './modules/hamburger';
// import modalVideo from "./modules/modal-video";





(function() {
  hamburger.init();
  loadResponsiveImage.init();
//  modalVideo.init();
})();
