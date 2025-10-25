let events = {};
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let isInitialized = false;

// === Функция для обновления событий (вызывается асинхронно) ===
function updateEvents(newEvents) {
	events = newEvents || {};
	if (isInitialized) {
		// Если календарь уже инициализирован — просто перерисовываем
		renderDesktopCalendar(currentMonth, currentYear);
		renderMobileCalendar(currentMonth, currentYear);
	}
	// Если ещё не инициализирован — инициализация произойдёт в DOMContentLoaded
}

// === Рендер десктопа ===
function renderDesktopCalendar(month, year) {
	const container = document.getElementById("desktop-calendar");
	const weekdaysHeader = document.getElementById("week-days-header");
	if (!container || !weekdaysHeader) return;

	container.innerHTML = "";
	weekdaysHeader.innerHTML = "";

	const daysInMonth = new Date(year, month + 1, 0).getDate();
	const dayNames = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

	// Текущая дата (для сравнения)
	const today = new Date();
	const todayYear = today.getFullYear();
	const todayMonth = today.getMonth();
	const todayDate = today.getDate();

	for (let day = 1; day <= daysInMonth; day++) {
		const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
			day
		).padStart(2, "0")}`;
		const dateObj = new Date(year, month, day);
		const dayOfWeek = dateObj.getDay();
		const normalizedIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
		const weekdayName = dayNames[normalizedIndex];
		const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
		const hasEvent = !!events[dateStr];

		const weekdayEl = document.createElement("span");
		weekdayEl.textContent = weekdayName;
		if (isWeekend) {
			weekdayEl.classList.add("weekend");
		}
		weekdaysHeader.appendChild(weekdayEl);

		const cell = document.createElement("div");
		cell.className = "day-cell";
		if (hasEvent) cell.classList.add("has-event");
		if (isWeekend) cell.classList.add("weekend");

		// === Добавлено: отметка сегодня и прошедших дат ===
		if (year === todayYear && month === todayMonth && day === todayDate) {
			cell.classList.add("today");
		} else if (
			year < todayYear ||
			(year === todayYear && month < todayMonth) ||
			(year === todayYear && month === todayMonth && day < todayDate)
		) {
			cell.classList.add("past");
		}

		cell.textContent = day;
		cell.dataset.date = dateStr;
		cell.dataset.weekend = isWeekend;

		cell.addEventListener("click", () =>
			showEventPopover(cell, dateStr, isWeekend)
		);
		container.appendChild(cell);
	}
}

// === Рендер мобильного ===
function renderMobileCalendar(month, year) {
	const container = document.getElementById("mobile-calendar");
	if (!container) return;

	container.innerHTML = "";

	const daysInMonth = new Date(year, month + 1, 0).getDate();
	const firstDay = new Date(year, month, 1).getDay(); // 0 = вс, 1 = пн, ..., 6 = сб
	const dayNames = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

	// Текущая дата
	const today = new Date();
	const todayYear = today.getFullYear();
	const todayMonth = today.getMonth();
	const todayDate = today.getDate();

	// --- Шапка с днями недели ---
	const header = document.createElement("div");
	header.className = "mobile-weekdays-header";
	dayNames.forEach((name, index) => {
		const dayEl = document.createElement("div");
		dayEl.className = "mobile-weekday";
		if (index === 5 || index === 6) {
			// Сб, Вс
			dayEl.classList.add("weekend");
		}
		dayEl.textContent = name;
		header.appendChild(dayEl);
	});
	container.appendChild(header);

	// --- Сетка дней ---
	const grid = document.createElement("div");
	grid.className = "mobile-days-grid";

	// Пустые ячейки до первого дня месяца
	const emptyCellsBefore = firstDay === 0 ? 6 : firstDay - 1;
	for (let i = 0; i < emptyCellsBefore; i++) {
		const emptyCell = document.createElement("div");
		emptyCell.className = "mobile-day empty";
		grid.appendChild(emptyCell);
	}

	// Дни месяца
	for (let day = 1; day <= daysInMonth; day++) {
		const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
			day
		).padStart(2, "0")}`;
		const dateObj = new Date(year, month, day);
		const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;
		const hasEvent = !!events[dateStr];

		let classes = ["mobile-day"];
		if (hasEvent) classes.push("has-event");
		if (isWeekend) classes.push("weekend");

		// Сегодня / прошедшие
		if (year === todayYear && month === todayMonth && day === todayDate) {
			classes.push("today");
		} else if (
			year < todayYear ||
			(year === todayYear && month < todayMonth) ||
			(year === todayYear && month === todayMonth && day < todayDate)
		) {
			classes.push("past");
		}

		const dayCell = document.createElement("div");
		dayCell.className = classes.join(" ");
		dayCell.textContent = day;
		dayCell.dataset.date = dateStr;
		dayCell.dataset.weekend = isWeekend;

		dayCell.addEventListener("click", () => {
			showEventPopover(dayCell, dateStr, isWeekend);
		});

		grid.appendChild(dayCell);
	}

	container.appendChild(grid);
}
// === Popover ===
function showEventPopover(targetCell, dateStr, isWeekend) {
	const popover = document.getElementById("events__modal");
	const arrow = document.getElementById("events__modal-arrow");
	const cityEvent = document.querySelector(".events__modal-city");
	const quantityEvent = document.querySelector(".events__modal-quantity");
	const dateEvent = document.querySelector(".events__modal-date");
	const descriptionEvent = document.querySelector(
		".events__modal-description"
	);
	const dayCell = document.querySelectorAll(".day-cell, .mobile-day");
	const linkEvent = document.querySelector(".events__modal-btn");
	const event = events[dateStr];
	if (!event) return;

	// Заполняем контент (исправлено: брали объект вместо полей)
	cityEvent.textContent = event.city;
	quantityEvent.textContent = event.quantity;
	dateEvent.textContent = event.date;
	descriptionEvent.textContent = event.description;
	linkEvent.href = event.link.trim();

	if (isWeekend) {
		popover.classList.add("weekend");
	} else {
		popover.classList.remove("weekend");
	}

	dayCell.forEach((day) => {
		if (day.classList.contains("is-active")) {
			day.classList.remove("is-active");
		}
	});

	// Добавляем класс активности дню
	targetCell.classList.add("is-active");

	// Позиционирование (без изменений)
	popover.style.display = "block";
	const popoverWidth = popover.getBoundingClientRect().width;
	popover.style.display = "none";

	const rect = targetCell.getBoundingClientRect();
	const scrollTop = window.scrollY;
	const scrollLeft = window.scrollX;
	const calendarContainer = document.querySelector(
		window.innerWidth <= 768
			? ".events__calendar-mobile"
			: ".events__calendar-horizontal"
	);
	const calendarRect = calendarContainer.getBoundingClientRect();
	const cellCenterX = rect.left + rect.width / 2;
	let left = cellCenterX - popoverWidth / 2 + scrollLeft;

	if (left + popoverWidth > calendarRect.right + scrollLeft) {
		left = calendarRect.right + scrollLeft - popoverWidth;
	}
	if (left < calendarRect.left + scrollLeft) {
		left = calendarRect.left + scrollLeft;
	}

	popover.style.left = left + "px";
	popover.style.top = rect.bottom + scrollTop + 14 + "px";

	const arrowOffsetX = cellCenterX - left;
	arrow.style.left = arrowOffsetX + "px";

	popover.style.display = "block";

	// Закрытие
	const btnClose = document.getElementById("events__modal-close"); // исправлено: не popover.getElementById
	const closeHandler = () => {
		popover.style.display = "none";
		popover.classList.remove("weekend");
		targetCell.classList.remove("is-active"); // ← убираем класс
	};

	btnClose.addEventListener("click", closeHandler, { once: true });
	document.addEventListener(
		"click",
		(e) => {
			if (
				!e.target.closest("#events__modal") &&
				!e.target.closest(".has-event")
			) {
				closeHandler();
			}
		},
		{ once: true }
	);
}

// === Навигация ===
document.getElementById("events__prev-month")?.addEventListener("click", () => {
	currentMonth--;
	if (currentMonth < 0) {
		currentMonth = 11;
		currentYear--;
	}
	updateCalendars();
});

document.getElementById("events__next-month")?.addEventListener("click", () => {
	currentMonth++;
	if (currentMonth > 11) {
		currentMonth = 0;
		currentYear++;
	}
	updateCalendars();
});

// === Обновление календарей ===
function updateCalendars() {
	const eventModal = document.getElementById("events__modal");
	const monthName = new Intl.DateTimeFormat("ru-RU", {
		month: "long",
	}).format(new Date(currentYear, currentMonth));
	const calendarCurrentMont = document.getElementById(
		"calendar__current-month"
	);
	if (!calendarCurrentMont) return;
	calendarCurrentMont.textContent = `${monthName} ${currentYear}`;
	renderDesktopCalendar(currentMonth, currentYear);
	renderMobileCalendar(currentMonth, currentYear);
	if (!eventModal) return;
	eventModal.style.display = "none";
}
