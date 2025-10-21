const tabs = () => {
	const inputAll = document.querySelectorAll("[data-tab]");

	inputAll.forEach((input) => {
		updateTabState(input);

		input.addEventListener("input", () => {
			resetTabState(input);
			inputAll.forEach((input) => {
				updateTabState(input);
			});
		});
	});
};

function updateTabState(input) {
	const targetId = input.getAttribute("data-tab");

	if (!targetId) return;

	const targetElement = document.getElementById(targetId);

	if (!targetElement) return;
	targetElement.classList.toggle("tab--active", input.checked);
}

function resetTabState(input) {
	const wrapper = input.closest(".tabs");
	if (!wrapper) return;
	const allTabs = wrapper.querySelectorAll(".tab-box");
	allTabs.forEach((tab) => tab.classList.remove("tab--active"));
}

tabs();
