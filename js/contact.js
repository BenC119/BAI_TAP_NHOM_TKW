document.addEventListener("DOMContentLoaded", () => {
   
    const header = document.getElementById("header");
    const hamburger = document.getElementById("hamburger");
    const navLinks = document.getElementById("nav-links");
    const fadeElements = document.querySelectorAll(".fade-in");
    const contactForm = document.getElementById("contactForm");

   
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
            item.style.transitionDelay = `${Math.min(index * 100, 300)}ms`;
            observer.observe(item);
        });
    } else {
        fadeElements.forEach(item => item.classList.add("appear"));
    }


    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const btn = contactForm.querySelector(".btn-submit");
            const originalText = btn.innerHTML;

         
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> ĐANG GỬI...';
            btn.style.opacity = "0.7";
            btn.style.pointerEvents = "none";

         
            setTimeout(() => {
                btn.innerHTML = '<i class="fa-solid fa-check"></i> ĐÃ GỬI THÀNH CÔNG';
                btn.style.background = "var(--accent-gold)";
                btn.style.color = "#000";
                
                contactForm.reset(); 

                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.background = "transparent";
                    btn.style.color = "var(--accent-gold)";
                    btn.style.opacity = "1";
                    btn.style.pointerEvents = "auto";
                }, 3000);
            }, 2000);
        });
    }
});