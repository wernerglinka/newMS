const { request, gql } = require('graphql-request');
const sectionQueries = require('./queries');

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

  const sourceURL = options.sourceURL;
  const contentTypes = options.contentTypes;

  /**
   * Building the section query strings
   * Note: Individual sections are the same accross content types. Meaning a banner section
   * is identical whether it is used in content type pages or Things.
   * However, the are presented as part of a grapgql fragment like "... on Page_Pagebuilder_Sections_Banner"
   * So the complete section query part includes the content type as the first part of the
   * fragment name, e.g. "Page", followed by the field definitions.
   * To reuse the section queries the content type is added programmatically.
   *  
   */ 
  
  // loop over all content types
  contentTypes.map(ct => {
    let allSections = ``;
    // loop over all sections
    Object.keys(sectionQueries).forEach(key => {
      // build the query string for this content type with all available sections
      // the common parts of this string come from "sectionQueries"
      allSections = `${allSections}... on ${ct[1].charAt(0).toUpperCase()}${ct[1].slice(1)}_${sectionQueries[key]}`;
    });
    // add the sections query string to array content types
    ct.push(allSections);
  })

  /**
   * Building the complete query string including all specified content types
   */
  // opening bracket for query
  let queryString = "query {";
  contentTypes.forEach(ct => 
    queryString = `
        ${queryString} ${ct[0]} {
          edges {
            node {
              pageProperties {
                layout
              }
              pageBuilder {
                sections {
                  ${ct[2]} 
                }
              }
              uri
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
    request(sourceURL, query)
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
            // get the page properties and the page sections for this page
            const { pageProperties, pageBuilder: {sections}, uri } = node;


            console.log(`this is the URI: ${uri.slice(1,-1)}`);

            // uri becomes the key for the file object
            // e.g. "/things/a-thing-page/" plus the file extension

            let fileName = `${uri.slice(1,-1)}.html`;

            

            // define the page
            const pageContent = {
              layout: pageProperties.layout,
              title: "Needs to be included in page properties",
              sections: sections,
              contents: Buffer.from('Not needed. If you see this, something is broken')
            };

            // add page to metalsmith object
            files[fileName] = pageContent;

            console.log(files);
          });
        
      })
      done();
    });
  
  }
};