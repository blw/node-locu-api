/**
 * Module dependencies.
 */
var _ = require('underscore')
  , expect = require('expect.js')
  , request = require('request')
  , url = require('url')
;

/**
 * Constants
 */
var VALID_OUTPUT = ['json'];
var MAX_RADIUS_METER = 50000;

var DEFAULT_PROTOCOL = 'http';
var DEFAULT_HOST = 'api.locu.com';
var DEFAULT_API_VERSION = '/v1_0';
/**
 * Constructor.
 */
var Module = function (params) {
    if (!_(params).has('key')) {
        throw new Error('No API key provided.');
    }
    this._key = params.key;

    if (_(params).has('output') && VALID_OUTPUT.indexOf(params.output) > -1) {
        this._output = params.output;
    } else {
        this._output = '';
    }
};

// Extracts required and optional parameter fields.
Module.prototype._extractSearchParams = function (params, raw) {
    var _raw = _(raw);

    expect(raw).to.have.keys('name', 'latitude', 'longitude', 'radius');
	expect(raw.radius).to.be.a('number');
	expect(raw.latitude).to.be.a('number');
	expect(raw.longitude).to.be.a('number');
    // Mandatory
    // -------------------------------------------------------------------------
    // Latitude and longitude.
    // Specified as latitude,longitude.
    params.push({key: 'name', value: raw.name});
	params.push({key: 'location', value: raw.latitude + ',' + raw.longitude});
	params.push({key: 'radius', value: raw.radius});

    // Optional
    // -------------------------------------------------------------------------
    // Keyword.
    // Matches against name, type, address, reviews, third party content.
    // Matches against names of places.
    if (_raw.has('locality')) {
        params.push({key: 'locality', value: raw.locality});
    }

    // rankby.

    // Types.
    // https://developers.google.com/places/documentation/supported_types
    // Restricts results to matching the specified types.
    if (_raw.has('types') && _.isArray(raw.types)) {
        var collected = [];
        _(raw.types).each(function (o) {
            if (_.some(VALID_TYPES, function (vt) {vt.code === o})) {
                collected.push(o);
            }
        });

        // If no types, use some default types.
        if (collected.length <= 0) {
            _(DEFAULT_VALID_TYPES).each(function (o) {
                collected.push(o.code);
            });
        }
        collected = collected.join('|');
        params.push({key: 'types', value: collected});
    }

    // For next page results.
    if (_raw.has('pagetoken')) {
        params.push({key: 'pagetoken', value: raw.pagetoken});
    }
};

Module.prototype._extractDetailsParams = function (params, raw) {
    var _raw = _(raw);
};

Module.prototype._getData = function (pathname, params, cb) {
    pathname = DEFAULT_API_VERSION + pathname
    params.push({key: 'api_key', value: this._key});

    var search = _(params).map(function (v) {
        return v.key + '=' + v.value;
    });
    search = encodeURI(search.join('&'));

    var requestUrl = url.format({
        protocol: DEFAULT_PROTOCOL
      , host: DEFAULT_HOST
      , pathname: pathname
      , search: search
    });
	console.log(requestUrl);
    request(requestUrl, function (error, response, body) {
        return cb(error, body);
    });
};

/**
 * Public methods.
 */
// -----------------------------------------------------------------------------
Module.prototype.search = function (raw, cb) {
    var params = [];
    try {
        this._extractSearchParams(params, raw);
    } catch (e) {
        return cb(e);
    }

	//http://api.locu.com/v1_0/venue/search/?name=coffee&api_key={API_KEY}
    this._getData('/venue/search/', params, cb);
};

Module.prototype.details = function (raw, cb) {
    var params = [];
    try {
        this._extractDetailsParams(params, raw);
    } catch (e) {
        return cb(e);
    }
	//http://api.locu.com/v1_0/venue/{venue Locu id}/?api_key={your API key}
    this._getData('/venue/'+raw.venue_id+"/", params, cb);
};

module.exports = Module;
