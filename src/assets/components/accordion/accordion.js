// аккордион
const accordionStart = () => {
    const btn = document.querySelectorAll(".accordion-btn");
    if (btn) {
        btn.forEach((item) => {
            if (item.classList.contains("--active")) {
                const accordionWrapp = item.closest(".accordion");
                accordionActive(accordionWrapp);
            }
        });
    }
};
accordionStart();

function accordion() {
    document.addEventListener("click", (event) => {
        const accordionBtn = event.target.closest(".accordion-btn");
        if (!accordionBtn) return;
        const accordionWrapp = accordionBtn.closest(".accordion");
        accordionBtn.classList.toggle("is-active");
        accordionActive(accordionWrapp);
    });
}
accordion();
function accordionActive(accordionWrapp) {
    if (accordionWrapp) {
        let panel = accordionWrapp.querySelector(".accordion__body");

        if (panel.style.maxHeight) {
            panel.style.maxHeight = null;
        } else {
            panel.style.maxHeight = panel.scrollHeight + "px";
        }
    }
}
