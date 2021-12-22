const { request, gql } = require('graphql-request');

const banner = require('./queries/banner');
const intro = require('./queries/intro');
const media = require('./queries/media');


/**
 * 
 * Metalsmith GraphQL plugin that uses a Wordpress Advanced Custom Fields flexible field 
 * layout object to define pages with sections.
 *
 * @param  {Object} options
 *   @property {String} sourceURL  // URL of the wordpress site
 *   
 */
 "use strict";


 module.exports = function getExternalPagesGraphQL(options) {
  options = options || {};

  if (!options.sourceURL) {
    console.log("Missing source URL");
    return;
  }

  if (!options.contentTypes.length) {
    console.log("Missing Content Type(s)");
    return;
  }

  // build the query string

  // opening bracket for query
  let queryString = "query {";

  options.contentTypes.forEach(ct => 
    queryString = `
        ${queryString} ${ct[0]} {
          edges {
            node {
              pageProperties {
                layout
              }
              pageBuilder {
                sections {
                  ... on ${ct[1].charAt(0).toUpperCase()}${ct[1].slice(1)}_${banner} 
                }
              }
            }
          }
        }
    `) 
  ;
  // add closing bracket for query
  queryString = `${queryString}}`;

  const query = gql`${queryString}`;

  return (files, metalsmith, done) => {

    // request all pages for the content types specified in options.contentTypes
    request(options.sourceURL, query)
    .then((data) => {

      /*
        the data will look something like this 
        {
          "data": {
            "pages": {
              "edges": [
                {
                  "node": {
                    "pageProperties": {
                      "layout": "sections.njk"
                    },
                    "pageBuilder": {
                      "sections": [
                        {
                          "component": "banner",
                          "animatesection": null,
                          ...
                          
                          "mediatype": "Image"
                        },
                        {
                          "component": "intro"
                        },
                        {
                          "component": "media"
                        }
                      ]
                    }
                  }
                }
              ]
            }
          }
        }
      */

      // loop over content types. key will be the content type like "pages"
      Object.keys(data).forEach((key, index) => {
          const contentType = key;
          const contentTypePages = data[key].edges;

          // loop over all pages for a content type
          contentTypePages.map(({node}) => {
            // get the page properties and the page sections
            const { pageProperties, pageBuilder: {sections} } = node;

            // get the page sections
            //const { sections } = node.pageBuilder;

            console.log(sections);
          });
          

      })

    


      done();
    });
  
  }
};