function initializeAvatarFeatures() {
	const handleFileSelect = (fileInput, previewContainer) => {
		const file = fileInput.files[0];
		const container = previewContainer.closest("[data-avatar]");
		if (!file.type.match("image.*")) {
			alert("Please select a valid image file.");
			return;
		}

		const reader = new FileReader();
		reader.onload = () => {
			previewContainer.innerHTML = `<img class="thumb" src="${reader.result}" alt="Avatar" />`;
			container.classList.add("active");
		};
		reader.readAsDataURL(file);
	};

	const handleDelete = (container) => {
		const previewContainer = container.querySelector(
			"[data-avatar='preview']"
		);
		const fileInput = container.querySelector("[data-avatar='input']");
		previewContainer.innerHTML = "";
		container.classList.remove("active");

		// Очистка файлового ввода
		const dt = new DataTransfer();
		fileInput.files = dt.files;
	};

	const handleEdit = (fileInput) => {
		fileInput.click();
	};

	// Инициализация событий
	document.querySelectorAll("[data-avatar]").forEach((container) => {
		const fileInput = container.querySelector("[data-avatar='input']");
		const previewContainer = container.querySelector(
			"[data-avatar='preview']"
		);
		const deleteButton = container.querySelector("[data-avatar='delete']");
		const editButton = container.querySelector("[data-avatar='edit']");

		fileInput?.addEventListener("change", () =>
			handleFileSelect(fileInput, previewContainer)
		);
		deleteButton?.addEventListener("click", () => handleDelete(container));
		editButton?.addEventListener("click", () => handleEdit(fileInput));
	});
}

initializeAvatarFeatures();
