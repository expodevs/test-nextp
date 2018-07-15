var gulp = require("gulp"),
    watch = require("gulp-watch"),
    prefixer = require("gulp-autoprefixer"),
    uglify = require("gulp-uglify"),
    sass = require("gulp-sass"),
    cssmin = require("gulp-clean-css"),
    rigger = require("gulp-rigger"),
    imagemin = require("gulp-imagemin"),
    pngquant = require("imagemin-pngquant"),
    rimraf = require("rimraf"),
    browserSync = require("browser-sync"),
    reload = browserSync.reload;

var path = {
    build: {
        html: "build/",
        js: "build/js/",
        css: "build/css/",
        img: "build/img/",
        fonts: "build/fonts/"
    },
    src: {
        html: "src/*.html",
        js: "src/js/main.js",
        style: "src/scss/*.scss",
        img: "src/img/**/*.*",
        fonts: "src/fonts/**/*.*"
    },
    watch: {
        html: "src/**/*.html",
        js: "src/js/**/*.js",
        style: "src/scss/**/*.scss",
        img: "src/img/**/*.*",
        fonts: "src/fonts/**/*.*"
    },
    clean: "./build"
};
gulp.task("html:build", function() {
    gulp.src(path.src.html)
    .pipe(rigger())
    .pipe(gulp.dest(path.build.html))
    .pipe(reload({stream: true}))
});
gulp.task("js:build", function() {
    gulp.src(path.src.js)
    .pipe(rigger())
    .pipe(uglify())
    .pipe(gulp.dest(path.build.js))
    .pipe(reload({stream: true}))
});
gulp.task("style:build", function() {
    gulp.src(path.src.style)
    .pipe(sass())
    .pipe(prefixer({
        browsers: ['last 2 versions'],
        cascade: false
  }))
    .pipe(cssmin())
    .pipe(gulp.dest(path.build.css))
    .pipe(reload({stream: true}))
});
gulp.task("image:build", function() {
    gulp.src(path.src.img)
    .pipe(imagemin({
        progressive: true,
        svgoPlugins: [{
            removeViewBox: false
        }],
        use: [pngquant()],
        interlaced: true
    }))
    .pipe(gulp.dest(path.build.img))
    .pipe(reload({stream: true}))
});
gulp.task("fonts:build", function() {
    gulp.src(path.src.fonts)
    .pipe(gulp.dest(path.build.fonts))
});

gulp.task("build", ["html:build", "js:build", "style:build", "fonts:build", "image:build"]);

gulp.task("watch", function() {
    watch([path.watch.html], function(s, i) {
        gulp.start("html:build")
    }), watch([path.watch.style], function(s, i) {
        gulp.start("style:build")
    }), watch([path.watch.js], function(s, i) {
        gulp.start("js:build")
    }), watch([path.watch.img], function(s, i) {
        gulp.start("image:build")
    }), watch([path.watch.fonts], function(s, i) {
        gulp.start("fonts:build")
    })
});
gulp.task("clean", function(s) {
    rimraf(path.clean, s)
});
gulp.task("webserver", function() {
    browserSync({
        server: {
            baseDir: "./build"
        },
        tunnel: true,
        host: "localhost",
        port: 3000,
        logPrefix: "expo_devs"
    })
});
gulp.task("default", ["build", "webserver", "watch"]);