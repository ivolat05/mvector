// Объект для хранения старых файлов
const fileStorage = new WeakMap();

function handleFileInput(inputElement) {
	const wrapper = inputElement.closest(".file");
	const filesList = wrapper.querySelector(".files__list");

	// Проверяем наличие файлов
	if (!inputElement.files.length) return;

	const typeFile = inputElement.files[0].type;

	// Проверяем, является ли файл изображением
	if (
		inputElement.matches(".file-input-img") &&
		!typeFile.match(/^image\//)
	) {
		alert("Выберите изображение");
		return;
	}

	// Объединяем старые и новые файлы
	const dt = new DataTransfer();
	const newFiles = Array.from(inputElement.files);
	let oldFiles = fileStorage.get(inputElement) || [];

	// Если поле не поддерживает множественный выбор
	if (!inputElement.hasAttribute("multiple")) {
		oldFiles = [];
		newFiles.splice(1);
	}

	// Добавляем старые файлы
	oldFiles.forEach((file) => dt.items.add(file));

	// Добавляем только уникальные новые файлы
	newFiles.forEach((file) => {
		const fileExists = oldFiles.some(
			(f) => f.name === file.name && f.size === file.size
		);
		if (!fileExists) dt.items.add(file);
	});

	// Обновляем inputElement и хранилище
	inputElement.files = dt.files;
	fileStorage.set(inputElement, Array.from(dt.files));

	// Рендерим файлы в зависимости от их типа
	if (inputElement.matches(".file-input-img")) {
		renderFilesImg(filesList, inputElement);
	} else {
		renderFiles(filesList, inputElement);
	}
}

function renderFiles(filesList, inputElement) {
	filesList.innerHTML = "";
	const files = fileStorage.get(inputElement) || [];
	const img = "../../assets/img/icon/file-icons.svg";
	const btnImg = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
	<path opacity="0.4" d="M16.3691 7.90607C16.3691 7.96274 15.925 13.58 15.6713 15.9441C15.5125 17.3949 14.5772 18.2749 13.1743 18.2999C12.0964 18.324 11.0412 18.3324 10.003 18.3324C8.90075 18.3324 7.82284 18.324 6.77654 18.2999C5.42064 18.2674 4.48456 17.3699 4.33381 15.9441C4.07284 13.5717 3.63682 7.96274 3.62871 7.90607C3.62061 7.73524 3.67572 7.57275 3.78756 7.44109C3.89778 7.31942 4.05663 7.24609 4.22359 7.24609H15.7824C15.9485 7.24609 16.0993 7.31942 16.2184 7.44109C16.3294 7.57275 16.3854 7.73524 16.3691 7.90607Z" fill="#FF8075"/>
	<path d="M17.5 4.98007C17.5 4.63758 17.2301 4.36925 16.9059 4.36925H14.4762C13.9818 4.36925 13.5522 4.0176 13.442 3.52178L13.3059 2.91431C13.1154 2.18016 12.4581 1.66602 11.7206 1.66602H8.2802C7.53458 1.66602 6.88378 2.18016 6.68603 2.9543L6.55879 3.52262C6.44775 4.0176 6.01821 4.36925 5.52464 4.36925H3.09488C2.76988 4.36925 2.5 4.63758 2.5 4.98007V5.29672C2.5 5.63088 2.76988 5.90753 3.09488 5.90753H16.9059C17.2301 5.90753 17.5 5.63088 17.5 5.29672V4.98007Z" fill="#FF8075"/>
	</svg>
	`;

	files.forEach((file) => {
		const fileContainer = document.createElement("div");
		const fileContainerName = document.createElement("div");
		const fileContainerIcon = document.createElement("div");
		const btn = document.createElement("button");

		fileContainer.classList.add("file-row-element");
		fileContainerIcon.classList.add("file__row-img");
		fileContainerName.classList.add("file__row--name");
		btn.classList.add("file__row--btn");

		btn.type = "button";

		fileContainerIcon.style.background = `url(${img})`;

		fileContainerName.textContent = file.name;
		btn.innerHTML = btnImg;

		btn.addEventListener("click", () => {
			handleFileDelete(inputElement, file.name);
		});

		fileContainer.appendChild(fileContainerIcon);
		fileContainer.appendChild(fileContainerName);
		fileContainer.appendChild(btn);

		filesList.appendChild(fileContainer);
	});
}

function renderFilesImg(filesList, inputElement) {
	filesList.innerHTML = "";
	const files = fileStorage.get(inputElement) || [];

	files.forEach((file) => {
		const fileContainer = document.createElement("div");
		const img = document.createElement("img");
		const reader = new FileReader();

		fileContainer.classList.add("file-image-box");

		reader.onload = (function (theFile) {
			return function (e) {
				// Render thumbnail.
				img.src = e.target.result;
				img.title = encodeURIComponent(theFile.name);

				fileContainer.appendChild(img);
				filesList.appendChild(fileContainer);
			};
		})(file);

		reader.readAsDataURL(file);
	});
}

function handleFileDelete(inputElement, fileName) {
	const dt = new DataTransfer();

	// Удаляем файл из списка
	const files = fileStorage.get(inputElement) || [];
	const updatedFiles = files.filter((file) => file.name !== fileName);

	updatedFiles.forEach((file) => dt.items.add(file));

	inputElement.files = dt.files;

	// Обновляем хранилище
	fileStorage.set(inputElement, updatedFiles);

	// Обновляем отображение
	const wrapper = inputElement.closest(".file");
	const filesList = wrapper.querySelector(".files__list");
	renderFiles(filesList, inputElement);
}

function highLightDropZone(event) {
	event.classList.add("--drop");
}

function unHighLightDropZone(event) {
	event.classList.remove("--drop");
}

function droppAddFile(event) {
	const fileWrapper = event.target.closest(".file");
	if (!fileWrapper) return;

	const input = fileWrapper.querySelector("input");
	const dt = event.dataTransfer;
	unHighLightDropZone(event.target);
	input.files = dt.files;
	handleFileInput(input);
}

function fileRezet(element) {
	const fileWrapp = element.closest(".file");

	if (!fileWrapp) return;

	const fileList = fileWrapp.querySelector(".files__list");
	if (fileList) {
		fileList.innerHTML = "";
	}

	const fileInput = fileWrapp.querySelector(".file-input");
	if (fileInput) {
		const dt = new DataTransfer();
		fileInput.files = dt.files;
		fileStorage.set(fileInput, []);
	}
}

// Устанавливаем обработчики для динамически добавленных инпутов
document.body.addEventListener("change", (event) => {
	if (event.target.matches(".file-input")) {
		handleFileInput(event.target);
	}
});

document.body.addEventListener("dragover", (event) => {
	if (event.target.matches(".file-drop")) {
		event.preventDefault();
		highLightDropZone(event.target);
	}
});

document.body.addEventListener("dragenter", (event) => {
	if (event.target.matches(".file-drop")) {
		event.preventDefault();
		highLightDropZone(event.target);
	}
});

document.body.addEventListener("dragleave", (event) => {
	if (event.target.matches(".file-drop")) {
		event.preventDefault();
		unHighLightDropZone(event.target);
	}
});

document.body.addEventListener("drop", (event) => {
	if (event.target.matches(".file-drop")) {
		event.preventDefault();
		droppAddFile(event);
	}
});

document.body.addEventListener("click", (event) => {
	if (event.target.matches(".file-rezet")) {
		event.preventDefault();
		fileRezet(event.target);
	}
});
