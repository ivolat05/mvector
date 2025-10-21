 document.body.addEventListener("change", (event) => {
	const checkbox = event.target;
	if (
		checkbox.tagName !== "INPUT" ||
		checkbox.type !== "checkbox" ||
		!checkbox.closest(".checkbox-tree-inner")
	) {
		return;
	}

	propagateDown(checkbox);
	propagateUp(checkbox);
});

// Устанавливает состояние всем потомкам (вниз)
function propagateDown(sourceCheckbox) {
	const container = sourceCheckbox
		.closest(".checkbox-tree-inner")
		?.querySelector(".checkbox-tree");
	if (!container) return;

	// Один раз сохранить состояние
	const checked = sourceCheckbox.checked;

	// Только прямые потомки
	const descendants = container.querySelectorAll(
		".checkbox-tree-inner input[type='checkbox']"
	);
	descendants.forEach((cb) => {
		if (cb !== sourceCheckbox) {
			cb.checked = checked;
			cb.indeterminate = false;
		}
	});
}

// Обновляет родительские чекбоксы (вверх)
function propagateUp(childCheckbox) {
	let currentItem = childCheckbox.closest(".checkbox-tree-inner");

	while (currentItem) {
		const parentTree = currentItem.closest(".checkbox-tree");
		const parentItem = parentTree?.closest(".checkbox-tree-inner");

		if (!parentItem) break;

		const parentCheckbox = parentItem.querySelector(
			"input[type='checkbox']"
		);
		if (!parentCheckbox) break;

		// Получаем только прямых детей
		const directChildren = parentItem.querySelectorAll(
			":scope > .checkbox-tree > .checkbox-tree-inner"
		);

		let total = 0;
		let checkedCount = 0;
		let indeterminateCount = 0;

		directChildren.forEach((child) => {
			const cb = child.querySelector("input[type='checkbox']");
			if (cb) {
				total++;
				if (cb.checked) checkedCount++;
				else if (cb.indeterminate) indeterminateCount++;
			}
		});

		if (checkedCount === total) {
			parentCheckbox.checked = true;
			parentCheckbox.indeterminate = false;
		} else if (checkedCount > 0 || indeterminateCount > 0) {
			parentCheckbox.checked = false;
			parentCheckbox.indeterminate = true;
		} else {
			parentCheckbox.checked = false;
			parentCheckbox.indeterminate = false;
		}

		currentItem = parentItem;
	}
}