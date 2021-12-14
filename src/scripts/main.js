// NOTE: main.js is called at the end of the document body - no DOMContentLoaded event needed
import Swup from 'swup';

import loadResponsiveImage from './modules/load-responsive-image';
import hamburger from './modules/hamburger';
import modalVideo from "./modules/modal-video";




function initPage() {
  // load the youTube video JS api
  // https://developers.google.com/youtube/iframe_api_reference
  // This code loads the IFrame Player API code asynchronously.
  const tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  const firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  // use a promise to manage the async onYouTubeIframeAPIReady function
  window.videoAPIReady = new Promise(resolve => {
    // upon YouTube API Ready we resolve the promise
    // we can then initialize video players in other modules
    // e.g. videoAPIReady.then(() => {})
    window.onYouTubeIframeAPIReady = () => resolve();
  });

  hamburger.init();
  loadResponsiveImage.init();
  modalVideo.init();
};

(function() {
  const swup = new Swup();

  initPage();

  swup.on('contentReplaced', initPage);
  
})();