document.addEventListener('DOMContentLoaded', () => {

    // 1. HIỆU ỨNG HEADER KHI CUỘN TRANG
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

        // Đóng menu khi click vào 1 link
        const links = document.querySelectorAll('.nav-links li a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // 3. HIỆU ỨNG CUSTOM CURSOR (CON TRỎ CHUỘT)
    const cursor = document.getElementById('customCursor');
    
    // Ẩn cursor mặc định trên thiết bị không phải cảm ứng
    if (matchMedia('(pointer:fine)').matches) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        // Tạo hiệu ứng to ra (event delegation hỗ trợ phần tử động)
        document.addEventListener('mouseover', (e) => {
            if (e.target.closest('a, button, .hamburger, input, textarea, select, .car-card, .filter-btn, .remember-me, .terms-check, .user-profile-btn')) {
                cursor.classList.add('hovering');
            }
        });
        document.addEventListener('mouseout', (e) => {
            if (e.target.closest('a, button, .hamburger, input, textarea, select, .car-card, .filter-btn, .remember-me, .terms-check, .user-profile-btn')) {
                cursor.classList.remove('hovering');
            }
        });
    } else {
        // Nếu là điện thoại/máy tính bảng, ẩn cursor custom đi
        cursor.style.display = 'none';
    }

    // 4. HIỆU ỨNG FADE-IN KHI CUỘN TRANG (INTERSECTION OBSERVER)
    const faders = document.querySelectorAll('.fade-in');
    
    const appearOptions = {
        threshold: 0.15, // Kích hoạt khi phần tử xuất hiện 15% trên màn hình
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target); // Ngừng theo dõi sau khi đã hiện ra
            }
        });
    }, appearOptions);

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });

    // 5. TIN TỨC: LỌC DANH MỤC BAN ĐẦU
    const filterBtns = document.querySelectorAll('.filter-btn');
    const newsCards = document.querySelectorAll('.news-list-card');

    if (filterBtns.length > 0 && newsCards.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                filterBtns.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                btn.classList.add('active');
                
                const filterValue = btn.getAttribute('data-filter');
                
                newsCards.forEach(card => {
                    if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
        
        // Kích hoạt filter mặc định nếu trang đang có class active khởi tạo
        const activeFilter = document.querySelector('.filter-btn.active');
        if(activeFilter) {
            activeFilter.click();
        }
    }

});
