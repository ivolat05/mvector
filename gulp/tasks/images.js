import webp from "gulp-webp";
import imagemin from "gulp-imagemin";
import mozjpeg from "imagemin-mozjpeg";
import optipng from "imagemin-optipng";
import svgo from "imagemin-svgo";
import filter from "gulp-filter";

export const images = () => {
	const svgFilter = filter(["**/*.svg", "!sprite.svg"], { restore: true });

	return (
		app.gulp
			.src(app.path.src.images)
			.pipe(app.plugins.plumber())
			.pipe(app.plugins.newer(app.path.build.images))

			// Создание WebP
			.pipe(app.plugins.if(app.isBuild, webp()))
			.pipe(
				app.plugins.if(
					app.isBuild,
					app.gulp.dest(app.path.build.images)
				)
			)

			// Вернуть оригинальные файлы (PNG, JPG) обратно в поток
			.pipe(app.gulp.src(app.path.src.images))
			.pipe(app.plugins.newer(app.path.build.images))

			// Оптимизация PNG, JPEG
			.pipe(
				app.plugins.if(
					app.isBuild,
					imagemin([
						mozjpeg({ quality: 75, progressive: true }),
						optipng({ optimizationLevel: 4 }),
					])
				)
			)
			.pipe(app.gulp.dest(app.path.build.images))

			// Фильтруем SVG (исключая sprite.svg)
			.pipe(svgFilter)
			.pipe(
				app.plugins.if(
					app.isBuild,
					imagemin([
						svgo({
							plugins: [
								{ name: "preset-default" }, // Включает стандартные оптимизации
								{ name: "removeViewBox", active: false }, // Явно отключаем удаление viewBox
							],
						}),
					])
				)
			)
			.pipe(svgFilter.restore)
			.pipe(app.gulp.dest(app.path.build.images))

			// Копирование sprite.svg без изменений
			.pipe(app.gulp.src(`${app.path.src.images}/sprite.svg`))
			.pipe(app.plugins.newer(app.path.build.images))
			.pipe(app.gulp.dest(app.path.build.images))

			.pipe(app.plugins.browsersync.stream())
	);
};
