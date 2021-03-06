#vinyl-string
[![Build Status](https://travis-ci.org/armordog/vinyl-string.svg?branch=master)](https://travis-ci.org/armordog/vinyl-string)

For the terminally lazy

###constructor(fileContents, options)
#### fileContents
The contents of the pretend file

Type: `String` or `Buffer`

#### options
An options object for the creation of a [vinyl file](https://github.com/gulpjs/vinyl/blob/master/README.md#constructoroptions).

#### options.keepOpen
Set to `true` to keep the stream open. Use when piping /into/ the vinyl-string object.


###example
```javascript
var vs = require('vinyl-string');
var vFile = vs(
  "my file contents!",
  {
    path: "filename.txt"
  }
);

vFile.pipe(gulp.dest("./output"));
```

```javascript
/* if vFile is also a stream destination, set keepOpen: true */
var vs = require('vinyl-string');
var vFile = vs(
  "my file contents!",
  {
    path: "filename.txt",
    keepOpen: true // allow piping in to vFile
  }
);

gulp.src(["./src/*.txt"])
  .pipe(vFile)
  .pipe(gulp.dest("./output");
```
