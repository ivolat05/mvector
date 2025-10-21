function maskPhone() {
	let inputs = document.querySelectorAll("input[type='tel']");
	if (inputs) {
		let im = new Inputmask("+7 (999) 999 - 99 - 99");
		inputs.forEach((element) => {
			im.mask(element);
		});
	}
}

maskPhone();
