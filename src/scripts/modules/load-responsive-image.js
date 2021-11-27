import debounce from "../utilities/debounce";

const loadImage = ((entries) => {

  for (let entry of entries) {
    if ( entry.isIntersecting) {
      const thisWrapper = entry.target;

      // get the dimensions of the image wrapper and the display pixel density
      const imageWidth = thisWrapper.clientWidth;
      const imageHeight = thisWrapper.clientHeight;
      const pixelRatio = window.devicePixelRatio || 1.0;
      
      // assemble url parameters for the cloudinary image url
      const imageParams = `w_${100 * Math.round((imageWidth * pixelRatio) / 100)},f_auto`;

      // find the high res image in the wrapper and get the data attributes...
      const thisImage = thisWrapper.querySelector(".high-res");
      const thisImagePrefix = thisImage.dataset.prefix;
      const thisImageSource = thisImage.dataset.source;
      // ...so we can assemble and replace the image src url
      thisImage.src = `${thisImagePrefix}${imageParams}/${thisImageSource}`;
      // once the hi-res image has been loaded, add done class to wrapper
      // which will fade-in the hi-res image
      thisImage.onload = () => {
        thisWrapper.classList.add("done");
      };
    }
  }
});


const updateImage = debounce(function() {
  // images are only loaded when they are visible
  const observer = new IntersectionObserver(loadImage);

  // loop over all image wrappers and add to intersection observer
  const allHiResImageWrappers = document.querySelectorAll(".js-progressive-image-wrapper");
  for ( let imageWrapper of allHiResImageWrappers ) {
    observer.observe(imageWrapper);
  }
}, 500);


function loadResponsiveImage() {
  // images will update on page load and after a resize
  const resizeObserver = new ResizeObserver(updateImage);
  const resizeElement = document.body;
  resizeObserver.observe(resizeElement);
}

export default loadResponsiveImage;