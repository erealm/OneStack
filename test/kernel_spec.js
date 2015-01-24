'use strict';

/**
 * Test Module dependencies.
 */

// Init the configuration module
var kernel = require('../index');
var should = require('should');

describe('Index', function () {
    it('should throw error when missing PORT', function () {
        (function () {
            // reset kernel settings
            kernel.settings = {};
            // initialize application with configuration folder
            kernel.init(__dirname + '/full_customized');
            kernel.welcome();
        }).should.not.throw();
    });
});
