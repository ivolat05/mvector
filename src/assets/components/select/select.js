// Функция закрытия всех dropdown
function selectsClose(excludeSelect = null) {
	const allSelects = document.querySelectorAll(
		".select.is-active, .select.open-up"
	);
	allSelects.forEach((dropdown) => {
		if (dropdown !== excludeSelect) {
			dropdown.classList.remove("is-active", "open-up");
		}
	});
}

// Обработка выбора элемента
function handleSelectChoice(item) {
	const select = item.closest(".select");
	const inputHidden = select.querySelector(".select__hidden-input");
	const currentText = select.querySelector(".select__current");
	const selectedText = item.innerText.trim();
	if (!currentText) return;
	currentText.innerText = selectedText;
	currentText.classList.add("selected");
	if (!inputHidden) return;
	inputHidden.value = selectedText;
	selectsClose();
}

// Проверка направления открытия dropdown
function dropdownOrientation(select) {
	const rect = select.getBoundingClientRect();
	const selectsBody = select.querySelector(".select__body");
	const windowHeight = window.innerHeight;

	if (rect.bottom + selectsBody.offsetHeight > windowHeight) {
		select.classList.add("open-up");
	} else {
		select.classList.remove("open-up");
	}
}

// Основной обработчик событий
document.addEventListener("click", function (event) {
	const select = event.target.closest(".select");
	const selectHeader = event.target.closest(".select__header");
	const selectItem = event.target.closest(".select__item");

	if (select) {
		if (selectHeader) {
			if (select.classList.contains("is-active")) {
				select.classList.remove("is-active", "open-up");
			} else {
				selectsClose(select);
				select.classList.add("is-active");
				dropdownOrientation(select);
			}
		} else if (selectItem) {
			handleSelectChoice(selectItem);
		}
	} else {
		selectsClose();
	}
});

// Закрытие всех dropdown по Escape
document.addEventListener("keydown", (event) => {
	if (event.key === "Escape") {
		selectsClose();
	}
});
