const gulp = require('gulp');
const zip = require('gulp-zip');

// 拼接脚本
gulp.task('v2', function() {
    return gulp.src([
        'src/fetch.umd.js',
        'src/live2d-sdk.clj-pack.min.js',
        'src/laya-l2d.js',
        'src/character-skin.js',
    ], { base: 'src' })
    .pipe(gulp.dest('public/live2d-character-v2/lib'));
});

// 打包
gulp.task('v2-pack', function() {
    return gulp.src([
        'public/live2d-character-v2/mod.json',
        'public/live2d-character-v2/preview.jpg',
        'public/live2d-character-v2/lib/*.js',
        'public/live2d-character-v2/files/0/live2d/**/**/*',
        'public/live2d-character-v2/files/0/live2d/**/**/**/*',
    ], { base: 'public' })
    .pipe(zip('live2d-character-v2.mspm'))
    .pipe(gulp.dest('dist'));
});

gulp.task('v2-default', gulp.series('v2', 'v2-pack'));
