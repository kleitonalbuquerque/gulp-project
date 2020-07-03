const { src, dest, watch, parallel } = require('gulp');
const sass          = require('gulp-sass');
const ejs           = require('gulp-ejs');
const rename        = require('gulp-rename');
const eslint        = require('gulp-eslint');
const mocha         = require('gulp-mocha');

function copy(cb) {
  src('routes/*.js')
    .pipe(dest('copies'));
  cb();
}

function generateCss(cb) {
  src('./sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(dest('public/stylesheets'));
  cb();
}

function generateHTML(cb) {
  src('./views/index.ejs')
    .pipe(ejs( {
      title: 'Hello Marianinha!',
    }))
    .pipe(rename({
      extname: '.html'
    }))
    .pipe(dest('public'));
  cb();
}

function runLinter(cb) {
  return src(['**/*.js', '!node_modules/**'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
    .on('end', function() {
      cb();
    });
}

function runTest(cb) {
  return src(['**/*.test.js'])
    .pipe(mocha())
    .on('error', function() {
      cb(new Error('Test failed'));
    })
    .on('end', function() {
      cb();
    });
}

function watchFiles(cb) {
  watch('views/**.ejs', generateHTML);
  watch('sass/**.scss', generateCss);
  watch(['**/*.js', '!node_modules/**'], parallel(runLinter, runTest));
  cb();
}

exports.copy  = copy;
exports.css   = generateCss;
exports.html  = generateHTML;
exports.lint  = runLinter;
exports.test  = runTest;
exports.watch = watchFiles; 