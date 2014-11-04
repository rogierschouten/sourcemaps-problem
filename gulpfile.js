
var eventStream = require("event-stream");
var gulp = require("gulp");
var debug = require("gulp-debug");
var typescript = require("gulp-typescript");
var sourcemaps = require("gulp-sourcemaps");

var typeScriptOpts = {           // for full list of options see https://github.com/kotas/gulp-tsc
	"module": "commonjs",        // don't make AMD modules (note: "module" is a keyword so quote)
	target: "es5",               // JavaScript language version
	emitError: true,        // allow the task to continue on typescript errors (useful for the "watch" task)
	sourceRoot: "",
	removeComments: false,       // not necessary: uglify() does this when we release
	noImplicitAny: true,         
	declaration: true,			 // generate .d.ts files
	//noExternalResolve: true    // should lead to faster compiles, but needs all files to be passed in (incl typings)
};

gulp.task("default", [], function() {
	var tsResult =
		 gulp.src("./lib/**/*.ts", { base: "." })
		.pipe(debug())
		.pipe(sourcemaps.init())
		.pipe(typescript(typeScriptOpts));

	var jsStream =
		tsResult.js
		.pipe(sourcemaps.write())
		.pipe(gulp.dest("."));
		
	var dtsStream =
		tsResult.dts;
		
	var result = eventStream.duplex(tsResult, eventStream.merge(jsStream, dtsStream));
		
	return result;
});
