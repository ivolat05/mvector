// Получаем базовый размер 1rem в пикселях (учитывая настройки браузера)
const baseRem = parseFloat(getComputedStyle(document.documentElement).fontSize);
/**
 * Конвертирует px в px с учётом rem
 * 1. px → rem (px / 16, так как 1rem = 16px по умолчанию)
 * 2. rem → px с учётом текущего baseRem
 *
 * @param {number} px - Значение в пикселях, которое нужно адаптировать
 * @returns {number} - Преобразованное значение в пикселях для Swiper
 */
const pxToSwiper = (px) => (px / 16) * baseRem;
