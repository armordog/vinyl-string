describe("vinyl-string", function () {

	var vinyl = require('vinyl');
	var stream = require('stream');
	var vs = require('../index.js');

	var TEST_STRING = "Electric Mayhem";

	beforeEach(function () {
		jasmine.addMatchers({
			toBeVinyl: function () {
				return {
					compare: function(actual) {
						var result = {
							pass: vinyl.isVinyl(actual)
						};
						return result;
					}
				};
			}
		});
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

});