import fs from "fs";
import fonter from "gulp-fonter";
import ttf2woff2 from "gulp-ttf2woff2";

export const otfToTtf = () => {
	// Ищем файлы шрифтов .otf
	return (
		app.gulp
			.src(`${app.path.srcFolder}/assets/fonts/*.otf`, {})
			.pipe(
				app.plugins.plumber(
					app.plugins.notify.onError({
						title: "FONTS",
						message: "Error: <%= error.message %>",
					})
				)
			)
			// Конвертируем в .ttf
			.pipe(
				fonter({
					formats: ["ttf"],
				})
			)
			// Выгрузка в исходную папку
			.pipe(app.gulp.dest(`${app.path.srcFolder}/assets/fonts/`))
	);
};

export const ttfToWoff = () => {
	// Ищем файлы шрифтов .otf
	return (
		app.gulp
			.src(`${app.path.srcFolder}/assets/fonts/*.ttf`, {})
			.pipe(
				app.plugins.plumber(
					app.plugins.notify.onError({
						title: "FONTS",
						message: "Error: <%= error.message %>",
					})
				)
			)
			// Конвертируем в .woff
			.pipe(
				fonter({
					formats: ["woff"],
				})
			)
			// Выгрузка в папку с результатом
			.pipe(app.gulp.dest(`${app.path.build.fonts}`))
			// Ищем файйлы шрифтов .ttf
			.pipe(app.gulp.src(`${app.path.srcFolder}/assets/fonts/*.ttf`))
			// Конвертируем в .woff2
			.pipe(ttf2woff2())
			// Выгрузка в папку с результатом
			.pipe(app.gulp.dest(`${app.path.build.fonts}`))
	);
};

export const fontsStyle = () => {
	// Файл стилей подключение шрифтов
	let fontsFile = `${app.path.srcFolder}/assets/scss/vendor/fonts.scss`;
	// Проверяем существуют ли файлы шрифтов
	fs.readdir(app.path.build.fonts, function (err, fontsFiles) {
		if (fontsFiles) {
			// Проверяем существует ли файл стилей для подключения шрифтов
			if (!fs.existsSync(fontsFile)) {
				// Если файла нет, то создаем его
				fs.writeFile(fontsFile, "", cb);
				let newFileOnly;
				let fontStyle;
				for (var i = 0; i < fontsFiles.length; i++) {
					// Записываем подключение шрифтов в файл стилей
					let fontFileName = fontsFiles[i].split(".")[0];
					if (newFileOnly !== fontFileName) {
						let fontName = fontFileName.split("-")[0]
							? fontFileName.split("-")[0]
							: fontFileName;
						let fontWeight = fontFileName.split("-")[1]
							? fontFileName.split("-")[1]
							: fontFileName;
						if (
							fontWeight.toLowerCase() === "thin" ||
							fontWeight.toLowerCase() === "hairline"
						) {
							fontWeight = 100;
							fontStyle = "normal";
						} else if (
							fontWeight.toLowerCase() === "thinitalic" ||
							fontWeight.toLowerCase() === "hairlineitalic"
						) {
							fontWeight = 100;
							fontStyle = "italic";
						} else if (
							fontWeight.toLowerCase() === "extralight" ||
							fontWeight.toLowerCase() === "ultralight"
						) {
							fontWeight = 200;
							fontStyle = "normal";
						} else if (
							fontWeight.toLowerCase() === "extralightitalic" ||
							fontWeight.toLowerCase() === "ultralightitalic"
						) {
							fontWeight = 200;
							fontStyle = "italic";
						} else if (fontWeight.toLowerCase() === "light") {
							fontWeight = 300;
							fontStyle = "normal";
						} else if (fontWeight.toLowerCase() === "lightitalic") {
							fontWeight = 300;
							fontStyle = "italic";
						} else if (
							fontWeight.toLowerCase() === "normal" ||
							fontWeight.toLowerCase() === "regular"
						) {
							fontWeight = 400;
							fontStyle = "normal";
						} else if (
							fontWeight.toLowerCase() === "normalitalic" ||
							fontWeight.toLowerCase() === "regularitalic"
						) {
							fontWeight = 400;
							fontStyle = "italic";
						} else if (fontWeight.toLowerCase() === "medium") {
							fontWeight = 500;
							fontStyle = "normal";
						} else if (
							fontWeight.toLowerCase() === "mediumitalic"
						) {
							fontWeight = 500;
							fontStyle = "italic";
						} else if (
							fontWeight.toLowerCase() === "semibold" ||
							fontWeight.toLowerCase() === "demibold"
						) {
							fontWeight = 600;
							fontStyle = "normal";
						} else if (
							fontWeight.toLowerCase() === "semibolditalic" ||
							fontWeight.toLowerCase() === "demibolditalic"
						) {
							fontWeight = 600;
							fontStyle = "italic";
						} else if (fontWeight.toLowerCase() === "bold") {
							fontWeight = 700;
							fontStyle = "normal";
						} else if (fontWeight.toLowerCase() === "bolditalic") {
							fontWeight = 700;
							fontStyle = "italic";
						} else if (
							fontWeight.toLowerCase() === "extrabold" ||
							fontWeight.toLowerCase() === "ultrabold"
						) {
							fontWeight = 800;
							fontStyle = "normal";
						} else if (
							fontWeight.toLowerCase() === "extrabolditalic" ||
							fontWeight.toLowerCase() === "ultrabolditalic"
						) {
							fontWeight = 800;
							fontStyle = "italic";
						} else if (
							fontWeight.toLowerCase() === "black" ||
							fontWeight.toLowerCase() === "heavy"
						) {
							fontWeight = 900;
							fontStyle = "normal";
						} else if (
							fontWeight.toLowerCase() === "blackitalic" ||
							fontWeight.toLowerCase() === "heavyitalic"
						) {
							fontWeight = 900;
							fontStyle = "italic";
						} else if (
							fontWeight.toLowerCase() === "extrablack" ||
							fontWeight.toLowerCase() === "extraheavy"
						) {
							fontWeight = 950;
							fontStyle = "normal";
						} else if (
							fontWeight.toLowerCase() === "extrablackitalic" ||
							fontWeight.toLowerCase() === "extraheavyitalic"
						) {
							fontWeight = 950;
							fontStyle = "italic";
						} else {
							fontWeight = 400;
							fontStyle = "normal";
						}
						fs.appendFile(
							fontsFile,
							`@font-face {\n\tfont-family: '${fontName}';\n\tfont-display: swap;\n\tsrc: url("../../assets/fonts/${fontFileName}.woff2") format("woff2"),\n\t url("../../assets/fonts/${fontFileName}.woff") format("woff");\n\tfont-weight: ${fontWeight};\n\tfont-style:${fontStyle};\n}\r\n`,
							cb
						);
						newFileOnly = fontFileName;
					}
				}
			} else {
				// Если файл есть, выводим сообщение
				console.log(
					"Файл /assets/scss/fonts.scss уже существует. Для обновлни удалите его!"
				);
			}
		}
	});

	return app.gulp.src(`${app.path.srcFolder}`);
	function cb() {}
};
