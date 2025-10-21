// Открытие модального окна
function modalOpen(modalId) {
	if (modalId) {
		modalId.classList.add("--active");
		htmlRootLock();
	}
}

// Закрытие конкретного модального окна
function modalClose(modal) {
	if (modal) {
		modal.classList.remove("--active");
		htmlRootUnlock();
	}
}

// Закрытие всех модальных окон
function closeAllModals() {
	const modals = document.querySelectorAll(".modal-background");
	modals.forEach((modal) => modalClose(modal));
}

document.addEventListener("click", (event) => {
	const attributeModalOpen = event.target.closest("[data-open-modal]");
	if (attributeModalOpen) {
		event.preventDefault();
		const id = attributeModalOpen.dataset.openModal;
		const modal = document.getElementById(id);
		closeAllModals();
		modalOpen(modal);
	}

	if (
		event.target.closest(".btn__modal--close") ||
		(!event.target.closest(".modal__container") &&
			event.target.closest(".modal-background") &&
			!event.target.closest(".modal__blocked-close"))
	) {
		event.preventDefault();
		closeAllModals();
	}
});

document.addEventListener("keydown", (event) => {
	if (event.key === "Escape") {
		closeAllModals();
	}
});
