/**
 * Module dependencies.
 */
var MenuAPI = require('./locu/menu')
;

/**
 * Constructor.
 */
var Module = function (params) {
    if (!params.key) {
        throw new Error('No key provided.');
    }
    this.key = params.key;
    this.menu = this.menuAPI = new MenuAPI({key: this.key})
};

/**
 * Static members.
 */
Module.version = '0.0.1';

/**
 * Public methods.
 */

module.exports = Module;
