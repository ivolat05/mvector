function scrollTop() {
	const btn = document.querySelector(".button-scroll");

	if (!btn) return;
	btn.addEventListener("click", (e) => {
		e.preventDefault();
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	});
}
scrollTop();
