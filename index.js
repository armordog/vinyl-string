/* vinyl-string */

'use strict';

function stringToVinylStream (rawContents, options) {
	var File = require('vinyl');
	var Transform = require('stream').Transform;
	var keepOpen = false;

	options = options || {};

	var vFile = new File({
		cwd: options.cwd,
		base: options.base,
		path: options.path,
		history: options.history,
		stat: options.stat,
		contents: wrapContents(rawContents)
	});

	var stream = new Transform({
		objectMode: true,
		transform: function (chunk, encoding, next) {
			// passthrough
			next(null, chunk);
		}
	});

	stream.push(vFile);
	if (!options.keepOpen) {
		stream.push(null);
	}

	return stream;
}

function wrapContents (raw) {
	if (Buffer.isBuffer(raw)) {
		return raw;
	}
	
	return new Buffer(raw);
}

module.exports = stringToVinylStream;