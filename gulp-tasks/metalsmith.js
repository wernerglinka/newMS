const Metalsmith = require('metalsmith');
const assets = require('metalsmith-assets');
const loadData = require('metalsmith-data-loader');
const layouts = require('metalsmith-layouts');
const inplace = require('metalsmith-in-place');
const permalinks = require('@metalsmith/permalinks');
const writeMetadata = require('metalsmith-writemetadata');
const linkcheck = require('metalsmith-linkcheck');
const msif = require('metalsmith-if');
const CaptureTag = require('nunjucks-capture');

const date = require('metalsmith-build-date');

const util = require('gulp-util');

const showdown = require('showdown');
const converter = new showdown.Converter();

// functions to extend Nunjucks environment
const toUpper = string => string.toUpperCase();
const spaceToDash = string => string.replace(/\s+/g, '-');
const condenseTitle = string => string.toLowerCase().replace(/\s+/g, '');
const mdToHTML = string => converter.makeHtml(string);

// get working directory
// workingDir is a child of "__dirname"
const path = require('path');
const monitor = require('../local_modules/metalsmith-monitor');
const workingDir = path.join(__dirname, '../');

// Define engine options for the inplace and layouts plugins
const templateConfig = {
  engineOptions: {
    path: [`${workingDir}/layouts`, `${workingDir}/src/sources/assets/icons`],
    filters: {
      toUpper,
      spaceToDash,
      condenseTitle,
      mdToHTML,
    },
    extensions: {
      CaptureTag: new CaptureTag(),
    },
  },
};

/**
 *  Function to implement the Metalsmith build process
 */
module.exports = function metalsmith(callback) {
  console.log('Building site with metalsmith ************************');

  Metalsmith(workingDir)
    .source('./src/content')
    .destination('./build')
    .clean(true)

    // Load metadata from external files
    // Files are in either .yml or .json format
    // MetaData are inserted in each file like this: "data: !siteData.yml"
    // Reference: https://www.npmjs.com/package/metalsmith-data-loader
    .use(
      loadData({
        directory: 'src/data/',
      })
    )

    .use(date())

    .use(inplace(templateConfig))

    .use(permalinks())

    // layouts MUST come after permalinks so the template has access to the "path" variable
    .use(layouts(templateConfig))

    .use(
      assets({
        source: './src/assets/',
        destination: './assets/',
      })
    )

    // Show all metadata for each page in console
    // Used for Debug only
    .use(monitor())

    // Generate a metadata json file for each page
    // Used for Debug only
    .use(
      writeMetadata({
        pattern: ['**/*.html'],
        ignorekeys: ['next', 'contents', 'previous'],
        bufferencoding: 'utf8',
      })
    )

    .use(
      msif(!!util.env.linkcheck, () => {
        console.log('Checking internal links ******************************');
      })
    )
    .use(msif(!!util.env.linkcheck, linkcheck()))

    .build(err => {
      if (err) {
        throw err;
      }
      callback();
    });
};
