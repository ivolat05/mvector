/**
 * data-adapt-block="class, media, targetContainer"
 * targetContainer- позиция размещения элемента при перемещцнии
 * (last- перемещать в конец блока
 * first- перемещать в начало блока
 * либо указадть порядковый номер перемещения)
 * media - разрешение перемещения
 * class- класс блока в который переместить
 * пример: data-adapt-block=".block, 767, last"
 */

document.addEventListener("DOMContentLoaded", function () {
	// Парсинг элементов с атрибутом data-adapt-block
	function parseAdaptableElements(nodes) {
		return Array.from(nodes).map((node) => {
			const data = node.dataset.adaptBlock.trim();
			const [
				targetSelector,
				breakpoint = `${pxToSwiper(767)}`,
				position = "last",
			] = data.split(",").map((item) => item.trim());
			return {
				element: node,
				originalParent: node.parentNode,
				targetContainer: document.querySelector(targetSelector),
				breakpoint: parseInt(breakpoint, 10),
				position: position,
				originalIndex: Array.from(node.parentNode.children).indexOf(
					node
				),
			};
		});
	}

	// Перемещение элемента в новый контейнер
	function moveElement(position, element, targetContainer) {
		element.classList.add("_dynamic_adapt_");
		if (
			position === "last" ||
			position >= targetContainer.children.length
		) {
			targetContainer.appendChild(element);
		} else if (position === "first") {
			targetContainer.insertBefore(element, targetContainer.firstChild);
		} else {
			targetContainer.children[position].before(element);
		}
	}

	// Возврат элемента в оригинальный контейнер
	function restoreElement(originalParent, element, originalIndex) {
		element.classList.remove("_dynamic_adapt_");
		const referenceNode = originalParent.children[originalIndex] || null;
		originalParent.insertBefore(element, referenceNode);
	}

	// Сортировка адаптируемых объектов
	function sortAdaptableObjects(objects, type = "max") {
		const isAscending = type === "min";
		return objects.sort((a, b) => {
			if (a.breakpoint === b.breakpoint) {
				if (a.position === b.position) return 0;
				if (a.position === "first" || b.position === "last")
					return isAscending ? -1 : 1;
				if (a.position === "last" || b.position === "first")
					return isAscending ? 1 : -1;
				return isAscending
					? a.position - b.position
					: b.position - a.position;
			}
			return isAscending
				? a.breakpoint - b.breakpoint
				: b.breakpoint - a.breakpoint;
		});
	}

	// Обработчик изменения состояния медиа-запросов
	function handleMediaChange(matchMedia, adaptableObjects) {
		if (matchMedia.matches) {
			adaptableObjects.forEach((obj) =>
				moveElement(obj.position, obj.element, obj.targetContainer)
			);
		} else {
			adaptableObjects.forEach((obj) => {
				if (obj.element.classList.contains("_dynamic_adapt_")) {
					restoreElement(
						obj.originalParent,
						obj.element,
						obj.originalIndex
					);
				}
			});
		}
	}

	// Инициализация медиа-запросов для адаптации
	function setupMediaQueries(adaptableObjects, type, callback) {
		const uniqueMediaQueries = Array.from(
			new Set(
				adaptableObjects.map(
					(obj) =>
						`(${type}-width: ${pxToSwiper(
							obj.breakpoint
						)}px),${pxToSwiper(obj.breakpoint)}`
				)
			)
		);

		uniqueMediaQueries.forEach((query) => {
			const [mediaQuery, breakpoint] = query.split(",");
			const matchMedia = window.matchMedia(mediaQuery);
			const filteredObjects = adaptableObjects.filter(
				(obj) => pxToSwiper(obj.breakpoint) === parseInt(breakpoint, 10)
			);

			matchMedia.addEventListener("change", () =>
				callback(matchMedia, filteredObjects)
			);
			callback(matchMedia, filteredObjects);
		});
	}

	// Основная функция для динамической адаптации
	function dynamicAdaptation(type = "max") {
		const adaptableNodes = document.querySelectorAll("[data-adapt-block]");
		const adaptableObjects = parseAdaptableElements(adaptableNodes);
		const sortedObjects = sortAdaptableObjects(adaptableObjects, type);
		setupMediaQueries(sortedObjects, type, handleMediaChange);
	}

	// Запуск динамической адаптации
	dynamicAdaptation("max");
});
