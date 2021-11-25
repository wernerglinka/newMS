function loadResponsiveImage() {
  console.log("loadResponsiveImage");

  const allHiResImageWrappers = document.querySelectorAll(".js-progressive-image-wrapper");

  for ( let imageWrapper of allHiResImageWrappers ) {
    const imageWidth = imageWrapper.clientWidth;
    const imageHeight = imageWrapper.clientHeight;
    const pixelRatio = window.devicePixelRatio || 1.0;
    const imageParams = `w_${100 * Math.round((imageWidth * pixelRatio) / 100)},h_${100 * Math.round((imageHeight * pixelRatio) / 100)},c_fill,g_auto,f_auto`;

    const thisImage = imageWrapper.querySelector(".high-res");
    const thisImagePrefix = thisImage.dataset.prefix;
    const thisImageSource = thisImage.dataset.source;

    thisImage.src = `${thisImagePrefix}${imageParams}/${thisImageSource}`;
  }
  

}

export default loadResponsiveImage;