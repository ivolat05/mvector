import fs from "fs";
import path from "path";

export const server = (done) => {
    const baseDir = `${app.path.build.html}`;
    const preferredPage = "pages-list.html";
    const fallbackPage = "index.html";

    const preferredPath = path.join(baseDir, preferredPage);

    const startPage = fs.existsSync(preferredPath)
        ? preferredPage
        : fallbackPage;

    app.plugins.browsersync.init({
        server: {
            baseDir: baseDir,
            index: startPage, // <-- ключевая строка: задаёт стартовую страницу
        },
        notify: false,
        port: 3000,
        open: true,
    });

    done();
};
