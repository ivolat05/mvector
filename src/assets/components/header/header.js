document.addEventListener("click", (event) => {
	const targetElement = event.target;
	if (targetElement.closest(".header__open-menu")) {
		openMobileMenu();
	}
	if (
		targetElement.closest(".header__message-inner") ||
		targetElement.closest(".header__nav-btn") ||
		targetElement.closest(".header__nav-inner")
	) {
		closeMobileMenu();
	}
});

function openMobileMenu() {
	const html = document.querySelector("html");
	const mobileMenu = document.querySelector(".header__nav");
	html.classList.add("--is-fixed");
	if (!mobileMenu) return;
	mobileMenu.classList.add("-is-active");
}
function closeMobileMenu() {
	const html = document.querySelector("html");
	const mobileMenu = document.querySelector(".header__nav");
	html.classList.remove("--is-fixed");
	if (!mobileMenu) return;
	mobileMenu.classList.remove("-is-active");
}
