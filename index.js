/* vinyl-string */

'use strict';

function stringToVinylStream (string, options) {
	var File = require('vinyl');
	var Transform = require('stream').Transform;

	options = options || {};

	options.contents = new Buffer(string);

	var vFile = new File(options);

	var stream = new Transform({
		objectMode: true
	});

	stream.push(vFile);
	stream.push(null);

	return stream;
}

module.exports = stringToVinylStream;