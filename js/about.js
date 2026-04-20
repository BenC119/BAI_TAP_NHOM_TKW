/**
 * about.js — Trang Giới thiệu
 * home.js đã xử lý: header scroll, hamburger, custom cursor, fade-in.
 * File này dành cho hiệu ứng bổ sung riêng của trang About.
 */

document.addEventListener('DOMContentLoaded', () => {

    // Hiệu ứng parallax nhẹ cho ảnh brand-photo-frame khi cuộn
    const brandPhoto = document.querySelector('.brand-photo-frame img');
    if (brandPhoto && window.innerWidth > 992) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            brandPhoto.style.transform = `translateY(${scrolled * 0.06}px)`;
        }, { passive: true });
    }

    // Stagger delay cho fade-in của brand-steps
    document.querySelectorAll('.brand-step').forEach((step, i) => {
        step.style.transitionDelay = `${i * 0.08}s`;
    });

    // Stagger milestones & core cards
    document.querySelectorAll('.about-milestone, .about-core').forEach((card, i) => {
        card.style.transitionDelay = `${i * 0.12}s`;
    });

});
