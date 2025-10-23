/**
 * Инициализация Swiper с адаптацией под rem
 */

const swiperNearest = document.querySelector(".nearest__swiper");
const installSwiperNearest = {
	slidesPerView: 4,
	loop: true,
	spaceBetween: pxToSwiper(27),
	breakpoints: {
		[pxToSwiper(319.99)]: {
			slidesPerView: 1,
			spaceBetween: pxToSwiper(27),
		},
		[pxToSwiper(572.99)]: { slidesPerView: 2 },
		[pxToSwiper(820.99)]: {
			slidesPerView: 3,
		},
		[pxToSwiper(1100.99)]: {
			slidesPerView: 4,
			spaceBetween: pxToSwiper(27),
		},
	},
	navigation: {
		nextEl: ".nearest-button-next",
		prevEl: ".nearest-button-prev",
	},
};

const swiperReview = document.querySelector(".review__swiper");
const installSwiperReview = {
	slidesPerView: 2,
	loop: true,
	spaceBetween: pxToSwiper(40),
	breakpoints: {
		[pxToSwiper(319.99)]: {
			slidesPerView: 1,
			spaceBetween: pxToSwiper(20),
		},
		[pxToSwiper(572.99)]: {
			slidesPerView: 2,
			spaceBetween: pxToSwiper(20),
		},
		[pxToSwiper(992.99)]: {
			slidesPerView: 2,
			spaceBetween: pxToSwiper(30),
		},
		[pxToSwiper(1100.99)]: {
			slidesPerView: 2,
			spaceBetween: pxToSwiper(40),
		},
	},
	navigation: {
		nextEl: ".review-button-next",
		prevEl: ".review-button-prev",
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
	initSwiper(swiperNearest, installSwiperNearest);
	initSwiper(swiperReview, installSwiperReview);
});
