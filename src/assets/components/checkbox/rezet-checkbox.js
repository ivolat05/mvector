function rezetCheckbox() {
	const btnRezetAll = document.querySelectorAll(".rezet-btn");
	if (!btnRezetAll) return;
	btnRezetAll.forEach((btn) => {
		btn.addEventListener("click", () => {
			const wrapp = btn.closest(".rezet-wrapp");
			const allInput = wrapp.querySelectorAll("input");

			if (!allInput) return;
			allInput.forEach((input) => {
				if (input.checked) {
					input.checked = false;
				}
			});
		});
	});
}

rezetCheckbox();
