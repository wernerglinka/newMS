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

  // get file with all global file includes
  // these should include data to build the navigation, site globals etc.
  const include = fs.readFileSync(path.join(process.cwd(), '/src/data/pagesInclude.json'), {encoding:'utf8', flag:'r'});
  const includeData = JSON.parse(include).data;

  return (files, metalsmith, done) => {

    // get pages object from the WP site
    axios.get(options.sourceURL)
      .then(function (response) {
        // loop through all page objects and build the corresponsing Metalsmith object
        response.data.forEach(page => {
          // use WP slug as file name/object key
          const fileName = `${page.slug}.html`;
          const pageContent = {
            layout: page.acf.layout,
            title: fileName.replace(/-/g, ' '),
            data: includeData,
            sections: page.acf.sections,
            contents: Buffer.from('this is a wordpress page')
          };

          // add page to metalsmith object
          files[fileName] = pageContent;
        });

        done();
      })
      .catch(function (error) {
        console.log(error);
      })
      .then(function () {
        console.log("Done processing external files");
      });  

  }
};