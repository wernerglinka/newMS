const axios = require('axios').default;
const fs = require("fs");
const path = require('path');


/**
 * Metalsmith plugin that uses a Wordpress Advanced Custom Fields flexible field 
 * layout object to define pages with sections.
 *
 * @param  {Object} options
 *   @property {String} sourceURL  // URL of the wordpress site
 *   
 */
 "use strict";


 module.exports = function getExternalPages(options) {
  options = options || {};

  if (!options.sourceURL) {
    console.log("Missing source URL");
    return;
  }

  if (!options.contentTypes.length) {
    console.log("Missing Content Type(s)");
    return;
  }

  /**
   * function to adjust data file paths 
   * @param {*} contentType 
   * @returns {object} adjusted dat file paths
   * 
   * Page templates need access to site specific and navigation metadata. In markdown,
   * for top level pages, they would be included like so:
   *    data: 
   *      site: "../data/siteMetadata.json"
   *      nav: "../data/siteNavigation.json"
   * 
   * For external page we use an object in /src/data/pagesInclude.json to inject this info
   * programmatically. These paths needs adjustment for lower level pages. 
   * 
   * For all pages of content type "pages" we assume that the are at the top level. Other 
   * content types, like "things" will be one level below. e.g. /things/<page name>. For those
   * we add a "../" for each level.
   * 
   */
  function getDataIncludes (contentType) {
    // get file with all global file includes
    // these should include data to build the navigation, site globals etc.
    const include = fs.readFileSync(path.join(process.cwd(), '/src/data/pagesInclude.json'), {encoding:'utf8', flag:'r'});
    let includeData = JSON.parse(include).data;

    // add "../" for each level the new page is removed from "src" level
    const contentTypesArray = contentType.split("/");
    const pathLevel = "../";

    // if content type is "pages", array length will be 1. 
    if (contentTypesArray.length > 1) {
      for (let i = 1; contentTypesArray.length > i; i++) {
        // adjust pathLevel
        Object.keys(includeData).forEach(key => {
          includeData[key] = `${pathLevel}${includeData[key]}`;
        });
      }
    }
    return includeData;
  }

  return (files, metalsmith, done) => {
    // we will be requesting pages of different content types, one request for every content type

    // create an array of URLs to get the various content type pages
    // source: https://www.storyblok.com/tp/how-to-send-multiple-requests-using-axios
    const requestURLs = options.contentTypes.map(contentType => `${options.sourceURL}/${contentType}/`);
    // create array of request promises
    const allRequests = requestURLs.map(url => axios.get(url));

    // execute request for every content type
    axios.all(allRequests).then(axios.spread((...responses) => {
      
      // loop over all content types
      responses.forEach(response => {
        
        // build the pages for this content type
        response.data.forEach(page => {
          
          // use content type and WP slug as file name/object key
          const contentType = page.type === 'page' ? "" : `${page.type}/`;
          const fileName = `${contentType}${page.slug}.html`;

          // define the page
          const pageContent = {
            layout: page.acf.layout,
            title: fileName.replace(/-/g, ' '),
            data: getDataIncludes(contentType),
            sections: page.acf.sections,
            contents: Buffer.from('this is a wordpress page')
          };

          // add page to metalsmith object
          files[fileName] = pageContent;
        });
      })

      done();
    }));
  }
};