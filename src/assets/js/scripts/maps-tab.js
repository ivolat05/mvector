function mapsTab() {
	const allBtnControll = document.querySelectorAll(".maps-btn");
	const allTabMaps = document.querySelectorAll(".maps__info-tab");
	if (!allBtnControll) return;
	allBtnControll.forEach((btn) => {
		btn.addEventListener("click", () => {
			allTabMaps.forEach((tab) => {
				tab.classList.remove("-is-active");
			});
			if (btn.classList.contains("-is-active")) {
				btn.classList.remove("-is-active");
				return;
			}
			allBtnControll.forEach((btn) => {
				btn.classList.remove("-is-active");
			});

			btn.classList.add("-is-active");

			const attr = btn.getAttribute("data-map-id");
			if (!attr) return;
			const id = document.getElementById(attr);
			if (!id) return;
			id.classList.add("-is-active");
		});
	});
}

mapsTab();
