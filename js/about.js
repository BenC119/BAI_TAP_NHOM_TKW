document.addEventListener("DOMContentLoaded", () => {
    const header = document.getElementById("header");
    const hamburger = document.getElementById("hamburger");
    const navLinks = document.getElementById("nav-links");
    const fadeElements = document.querySelectorAll(".fade-in");

  
    window.addEventListener("scroll", () => {
        header.classList.toggle("scrolled", window.scrollY > 40);
    });


    if (hamburger && navLinks) {
        hamburger.addEventListener("click", () => {
            hamburger.classList.toggle("active");
            navLinks.classList.toggle("active");
        });

        navLinks.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                hamburger.classList.remove("active");
                navLinks.classList.remove("active");
            });
        });
    }

    // tech : (IntersectionObserver) : Hiệu ứng fade-in khi cuộn đến % nhất định của ảnh 
    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("appear");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        fadeElements.forEach((item, index) => {
            item.style.transitionDelay = `${Math.min(index * 70, 350)}ms`;
            observer.observe(item);
        });
    } else {
        fadeElements.forEach(item => item.classList.add("appear"));
    }
});