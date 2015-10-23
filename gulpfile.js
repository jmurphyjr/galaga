var fs = require('fs');
var path = require('path');

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');

// Load all gulp plugins automatically
// and attach them to the `plugins` object

var PluginOptions = {
    camelize: true
};

var gulpLoadPlugins = require('gulp-load-plugins');

var plugins = gulpLoadPlugins(PluginOptions);
// Temporary solution until gulp 4
// https://github.com/gulpjs/gulp/issues/355
var runSequence = require('run-sequence');

var pkg = require('./package.json');
var dirs = pkg['kavalla-configs'].directories;

// ---------------------------------------------------------------------
// | Helper tasks                                                      |
// ---------------------------------------------------------------------

gulp.task('archive:create_archive_dir', function () {
    fs.mkdirSync(path.resolve(dirs.archive), '0755');
});

var onError = function (err) {
    // gutil.beep();
    console.log(err.message);
};

gulp.task('archive:zip', function (done) {

    var archiveName = path.resolve(dirs.archive, pkg.name + '_v' + pkg.version + '.zip');
    var archiver = require('archiver')('zip');
    var files = require('glob').sync('**/*.*', {
        'cwd': dirs.dist,
        'dot': true // include hidden files
    });
    var output = fs.createWriteStream(archiveName);

    archiver.on('error', function (error) {
        done();
        throw error;
    });

    output.on('close', done);

    files.forEach(function (file) {

        var filePath = path.resolve(dirs.dist, file);

        // `archiver.bulk` does not maintain the file
        // permissions, so we need to add files individually
        archiver.append(fs.createReadStream(filePath), {
            'name': file,
            'mode': fs.statSync(filePath)
        });

    });

    archiver.pipe(output);
    archiver.finalize();

});

gulp.task('clean', function (done) {
    require('del')([
        dirs.archive,
        dirs.dist
    ], done);
});

gulp.task('copy', [
    'copy:index.html',
    // 'copy:main.css',
    'copy:misc',
    'copy:normalize'
]);

gulp.task('copy:index.html', function () {
    return gulp.src(dirs.src + '/index.html')
               .pipe(gulp.dest(dirs.dist));
});

gulp.task('copy:main.css', function () {

    var banner = '/*! Galaga v' + pkg.version +
                    ' | ' + pkg.license.type + ' License' +
                    ' | ' + pkg.homepage + ' */\n\n';

    return gulp.src(dirs.src + '/css/main.css')
               .pipe(plugins.header(banner))
               .pipe(plugins.autoprefixer({
                   browsers: ['last 2 versions', 'ie >= 8', '> 1%'],
                   cascade: false
               }))
               .pipe(gulp.dest(dirs.dist + '/css'));
});

gulp.task('copy:misc', function () {
    return gulp.src([

        // Copy all files
        dirs.src + '/**/*',

        // Exclude the following files
        // (other tasks will handle the copying of these files)
        '!' + dirs.src + '/css/main.css',
        '!' + dirs.src + '/index.html',
        '!' + dirs.src + '/js/*.js'

    ], {

        // Include hidden files by default
        dot: true

    }).pipe(gulp.dest(dirs.dist));
});

gulp.task('copy:normalize', function () {
    return gulp.src('node_modules/normalize.css/normalize.css')
               .pipe(gulp.dest(dirs.dist + '/css'));
});

gulp.task('lint:js', function () {
    return gulp.src([
      'gulpfile.js',
      dirs.src + '/js/*.js',
      dirs.test + '/*.js'
    ]).pipe(plugins.plumber({
        errorHandler: onError
    })).pipe(plugins.jscs())
    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter('jshint-stylish'))
    // .pipe(plugins.jshint.reporter('fail'))
    .pipe(plugins.livereload());
});

gulp.task('jasmine', function() {
    var filesForTest = ['src/**/*.js', 'spec/**/*_spec.js'];
    return gulp.src(filesForTest)
        .pipe(jasmine());
});

gulp.task('watch', function() {
    plugins.livereload.listen();
    var filesToWatch = ['SpecRunner.html', 'src/index.html', 'src/css/main.css', 'gulpfile.js', 'src/**/*.js', 'spec/**/*_spec.js'];
    gulp.watch(filesToWatch, ['lint:js']);
});

gulp.task('minify-js', function() {
    gulp.src('src/js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest(dirs.dist + '/js'));
});

gulp.task('minify-css', function() {
    gulp.src(dirs.src + '/css/main.css')
        .pipe(minifyCss())
        .pipe(gulp.dest(dirs.dist + '/css'));
});

// ---------------------------------------------------------------------
// | Main tasks                                                        |
// ---------------------------------------------------------------------

gulp.task('archive', function (done) {
    runSequence(
        'build',
        'archive:create_archive_dir',
        'archive:zip',
    done);
});

gulp.task('build', function (done) {
    runSequence(
        'clean',
        ['lint:js', 'minify-js', 'minify-css'],
        'copy',
    done);
});

gulp.task('default', ['jasmine']);
