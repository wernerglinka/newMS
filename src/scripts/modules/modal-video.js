const modalVideo = (function($, undefined) {
  const modalVideoTriggers = $('.js-modal-video');
  let player;
  let videoOverlay;

  // initialize all video links when the player is ready
  const initVideoLinks = function() {
    const videoOverlay = document.getElementById("video-overlay");
    const closeVideoOverlay = videoOverlay.querySelector('.close');

    modalVideoTriggers.each(function() {
      const thisTrigger = $(this);
      const requestedVideoID = thisTrigger.data('videoid');
      //const startTime = thisTrigger.data('start-time');
      //const endTime = thisTrigger.data('end-time');

      // inline links
      // turn data-video-link into a href attribute and remove disabled attribute
      //thisTrigger
      //  .attr('href', thisTrigger.data('video-link'))
      //  .removeAttr('data-video-link')
      //  .removeAttr('disabled');

      thisTrigger.on('click', e => {
        e.preventDefault();
        e.stopPropagation();

        // fade in the overlay
        videoOverlay.addEventListener('animationend', () => {
          videoOverlay.classList.add('is-open');
          videoOverlay.classList.remove('fadein');
        }, { once: true });
        videoOverlay.classList.add('fadein');

        document.body.classList.add('modalActive');
        
        // load the appropriate video ID
        // if the requested videoID is equal to what the player has already loaded
        // then just play the video else load the new video and then play it
        if (requestedVideoID === player.getVideoEmbedCode()) {
          player.playVideo();
        } else {
          player.loadVideoById({
            videoId: requestedVideoID,
            //startSeconds: startTime || null,
            //endSeconds: endTime || null,
          });
        }
        // we might have muted a previous video. set the default level
        player.setVolume(50);
      });
    });

    //closeVideoOverlay.on('click', () => {
      closeVideoOverlay.addEventListener("click", () => {
      // fadeout sound as we close the overlay
      let currentVolume = player.getVolume();
      const fadeout = setInterval(() => {
        if (currentVolume <= 0) {
          // use pauseVideo rather than stopVideo to minimize
          // previous video flashes when starting the new video
          player.pauseVideo();
          clearInterval(fadeout);
        }
        currentVolume -= 5;
        player.setVolume(currentVolume);
      }, 100);
      
      //videoOverlay.fadeOut();
      videoOverlay.addEventListener('animationend', () => {
        videoOverlay.classList.remove('is-open');
        videoOverlay.classList.remove('fadeout');
      }, { once: true });
      videoOverlay.classList.add('fadeout')
      
      document.body.classList.remove('modalActive');
    });
  };

  const onPlayerStateChange = function(event) {
    videoOverlay = $('#video-overlay');

    // player states
    // "unstarted"               = -1
    // YT.PlayerState.ENDED      =  0
    // YT.PlayerState.PLAYING    =  1
    // YT.PlayerState.PAUSED     =  2
    // YT.PlayerState.BUFFERING  =  3
    // YT.PlayerState.CUED       =  5

    switch (event.data) {
      case YT.PlayerState.PAUSED:
        break;

      case YT.PlayerState.PLAYING:
        break;

      case YT.PlayerState.ENDED:
        videoOverlay.fadeOut();
        break;

      case YT.PlayerState.CUED:
        break;

      default:
    }
  };

  const init = function() {
    // if no video trigger links on page return
    if (!$('.js-video-trigger')) {
      return;
    }

    // initialize all video players on a page
    // videoAPIReady is a defered jQuery object for when the Youtube API has been loaded
    window.videoAPIReady.then(() => {
      // create an video overlay
      $('body').append(`
        <div id="video-overlay" class="js-video-overlay">
            <span class="close">[Close]</span>
            <div class="responsive-wrapper">
                <div class="video-container">
                    <div id="ytvideo"></div>
                </div>
            </div>
        </div>
      `);

      videoOverlay = $('#video-overlay');
      const videoID = modalVideoTriggers.eq(0).data('videoid'); // the first video link
      //const startTime = modalVideoTriggers.eq(0).data('start-time');
      //const endTime = modalVideoTriggers.eq(0).data('end-time');

      // reference https://developers.google.com/youtube/player_parameters?playerVersion=HTML5
      const playerVars = {
        autoplay: 0,
        //start: startTime || null, // if no start or end time is specified go trom 0 to end
        //end: endTime || null, // start/stop via js commands
        controls: 0, // show video controls
        enablejsapi: 1, // enable the js api so we can control then player with js
        wmode: 'opaque', // allow other elements to cover video, e.g. dropdowns or pop-ups
        origin: window.location.origin, // prevent "Failed to execute 'postMessage' on 'DOMWindow'" error
        rel: 0, // disable other video suggestions after video end
      };

      // create the video player object
      player = new YT.Player('ytvideo', {
        videoId: videoID,
        playerVars,
        events: {
          onReady: initVideoLinks,
          onStateChange: onPlayerStateChange,
        },
      });
    });
  };

  return {
    init,
  };
})(jQuery);

export default modalVideo;