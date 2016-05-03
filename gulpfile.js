var gulp = require('gulp'),
    sass = require('gulp-sass'),
    less = require('gulp-less'),
    browserSync = require('browser-sync'), // ���������� Browser Sync
    concat      = require('gulp-concat'), // ���������� gulp-concat (��� ������������ ������)
    uglify      = require('gulp-uglifyjs'), // ���������� gulp-uglifyjs (��� ������ JS)
    cssnano     = require('gulp-cssnano'), // ���������� ����� ��� ����������� CSS
    rename      = require('gulp-rename'), // ���������� ���������� ��� �������������� ������
    del         = require('del'), // ���������� ���������� ��� �������� ������ � �����
    imagemin    = require('gulp-imagemin'), // ���������� ���������� ��� ������ � �������������
    pngquant    = require('imagemin-pngquant'), // ���������� ���������� ��� ������ � png
    autoprefixer = require('gulp-autoprefixer'),// ���������� ���������� ��� ��������������� ���������� ���������
    gutil = require( 'gulp-util' ),
    ftp = require( 'vinyl-ftp' );

gulp.task('default', ['watch']);

gulp.task('clear', function () {
    return cache.clearAll();
})

gulp.task('sass', function(){ // ������� ���� Sass
    return gulp.src('sass/**/*.scss') // ����� ��������
        .pipe(sass().on('error', sass.logError)) // ����������� Sass � CSS ����������� gulp-sass
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) // ������� ��������
        .pipe(gulp.dest('css')) // ��������� ���������� � ����� app/css
        .pipe(browserSync.reload({stream: true})) // ��������� CSS �� �������� ��� ���������
});

gulp.task('browser-sync', function() { // ������� ���� browser-sync
    browserSync({ // ��������� browser Sync
        server: { // ���������� ��������� �������
            baseDir: '' // ���������� ��� ������� - app
        },
        notify: false // ��������� �����������
    });
});


gulp.task('watch', ['browser-sync', 'sass'], function() {
    gulp.watch('sass/*.scss', ['sass']); // ���������� �� sass ������� � ����� sass
    gulp.watch('*.html', browserSync.reload); // ���������� �� HTML ������� � ����� �������
});


