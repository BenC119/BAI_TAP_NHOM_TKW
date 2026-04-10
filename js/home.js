document.addEventListener('DOMContentLoaded', () => {

    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. HAMBURGER MENU CHO MOBILE
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

    
        const links = document.querySelectorAll('.nav-links li a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // 3. HIỆU ỨNG FADE-IN KHI CUỘN TRANG
    const faders = document.querySelectorAll('.fade-in');
    const appearOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target); 
            }
        });
    }, appearOptions);

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });

   
    const newsletterForm = document.querySelector('.newsletter-form');
    const toast = document.getElementById('toast-notification');
    const toastClose = document.querySelector('.toast-close');

    if (newsletterForm && toast) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault(); 
            
            const emailInput = this.querySelector('input[type="email"]');
            if(emailInput) emailInput.value = '';

            toast.classList.add('show');

            setTimeout(() => {
                toast.classList.remove('show');
            }, 3500);
        });

        if (toastClose) {
            toastClose.addEventListener('click', () => {
                toast.classList.remove('show');
            });
        }
    }

});