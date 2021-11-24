/*jslint es6 */

/*
 * Metalsmith build file
 * Build site with `node build`
 */

'use strict';

const toUpper = function (string) {
    return string.toUpperCase();
};

const spaceToDash = function (string) {
    return string.replace(/\s+/g, "-");
};

const inplace = require('metalsmith-in-place');
const layouts = require('metalsmith-layouts');
const metalsmith = require('metalsmith');
const markdown = require('metalsmith-markdown');

const templateConfig = {
    engineOptions: {
        filters: {
            toUpper: toUpper,
            spaceToDash: spaceToDash
        }
    }
};

metalsmith(__dirname)
    .clean(true)
    .source('./src/')
    .destination('./build/')
    .use(inplace(templateConfig))
    .use(layouts(templateConfig))
    .build(function (err) {
        if (err) {
            throw err;
        }
        console.log('Build finished!');
    });