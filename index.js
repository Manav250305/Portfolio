
document.addEventListener("DOMContentLoaded", function () {
    const heroText = document.querySelector(".hero-text");

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    heroText.classList.add("show");
                }
            });
        },
        { threshold: 0.5 } 
    );

    observer.observe(heroText);
});

document.addEventListener("DOMContentLoaded", function () {
    const sections = document.querySelectorAll(".about-text");

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("show");
                }
            });
        },
        { threshold: 0.3 } 
    );

    sections.forEach((section) => observer.observe(section));
});

document.addEventListener("DOMContentLoaded", function () {
    const sections = document.querySelectorAll(".contact-box");

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("show");
                }
            });
        },
        { threshold: 0.3 } 
    );

    sections.forEach((section) => observer.observe(section));
});
