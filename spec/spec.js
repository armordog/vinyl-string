var stream = require('stream');
var Vinyl = require('vinyl');
var vs = require('../index.js');

describe("vinyl-string", function () {

	var TEST_STRING = "Electric Mayhem";

	beforeEach(function () {
		jasmine.addMatchers(getCustomMatchers());
	});

	it("should return a Transform", function () {
		var vStream = vs(TEST_STRING);
		expect(vStream).toEqual(jasmine.any(stream.Transform));
	});

	it("should return a Transform with a vinyl file", function () {
		var vStream = vs(TEST_STRING);
		var streamContents = vStream.read();
		expect(streamContents).toBeVinyl();
	});

	it("should return a Transform with a vinyl file with the original contents", function () {
		var vStream = vs(TEST_STRING);
		var streamContents = vStream.read();
		var fileContents = streamContents.contents.toString();
		expect(fileContents).toEqual(TEST_STRING);
	});

	it("should optionally accept a Buffer as contents", function () {
		var contentBuffer = new Buffer(TEST_STRING);
		var vStream = vs(contentBuffer);
		var streamContents = vStream.read();
		var rawFileContents = streamContents.contents;
		var parsedFileContents = rawFileContents.toString();

		expect(rawFileContents).toBe(contentBuffer);
		expect(parsedFileContents).toEqual(TEST_STRING);
	});

	it("should pass through input streams", function (done) {
		var UPSTREAM_CONTENT = "Upstream Content!";

		var vStream = vs(
			TEST_STRING,
			{
				keepOpen: true // prevent immediate closing of the stream
			}
		);

		var inputStream = getInputStream(UPSTREAM_CONTENT);

		var outputStream = inputStream.pipe(vStream);

		resolveStreamContents(outputStream).then(
			function (result) {
				expect(result[0].contents.toString()).toBe(TEST_STRING);
				expect(result[1].contents.toString()).toBe(UPSTREAM_CONTENT);
				expect(result.length).toBe(3);
			},
			function (error) {
				fail(error.message);
			}
		).then(
			done, done // no 'finally' yet
		);

	});

	it("should close the stream by default", function (done) {
		var vStream = vs(TEST_STRING);

		// listen for end
		vStream.on('end', function () {
			done();
		});

		// read everything out of the stream
		vStream.on('data', function () {
			// ignore contents
		});
	});

});


function getCustomMatchers () {
	return {
		toBeVinyl: function () {
			return {
				compare: function(actual) {
					var result = {
						pass: Vinyl.isVinyl(actual)
					};
					return result;
				}
			};
		}
	};
}

function getInputStream (contents) {
	return new stream.Readable({
		objectMode: true,
		read: function () {
			this.push(new Vinyl({
				contents: new Buffer(contents)
			}));
			this.push(new Vinyl({
				contents: new Buffer(contents + " 2")
			}));
			this.push(null);
		}
	});
}

function resolveStreamContents (stream) {
	return new Promise( function (resolve, reject) {

		var streamContents = [];

		stream.on('data', function (obj) {
			streamContents.push(obj);
		});

		stream.on('end', function () {
			resolve(streamContents);
		});

		stream.on('error', function (err) {
			reject(err);
		});

	});
}