/**
 * Инициализация Swiper с адаптацией под rem
 */

const swiperPopular = document.querySelector(".popular__swiper");
const installSwiperPopular = {
	slidesPerView: 4,
	spaceBetween: pxToSwiper(24),
	breakpoints: {
		[pxToSwiper(320)]: { slidesPerView: 1, spaceBetween: pxToSwiper(16) }, // 320px → rem → px
		[pxToSwiper(760)]: { slidesPerView: 2, spaceBetween: pxToSwiper(16) }, // 768px → rem → px
		[pxToSwiper(1140)]: { slidesPerView: 3, spaceBetween: pxToSwiper(12) },
		[pxToSwiper(1560)]: { slidesPerView: 4, spaceBetween: pxToSwiper(24) }, // 1024px → rem → px
	},
};
function initSwiper(swiper, installSwiper) {
	try {
		new Swiper(swiper, installSwiper);
	} catch (error) {
		console.log(`ошибка инициализации swiper: ${error}`);
	}
}

// Запускаем Swiper после загрузки DOM
document.addEventListener("DOMContentLoaded", () => {
	initSwiper(swiperPopular, installSwiperPopular);
});
