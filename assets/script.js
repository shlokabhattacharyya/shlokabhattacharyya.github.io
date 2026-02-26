document.addEventListener('DOMContentLoaded', () => {

    const toggle = document.querySelector('.theme-toggle');
    const saved = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
    updateToggleIcon(saved);

    if (toggle) {
        toggle.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
            updateToggleIcon(next);
        });
    }

    function updateToggleIcon(theme) {
        const moon = document.querySelector('.icon-moon');
        const sun = document.querySelector('.icon-sun');
        if (!moon || !sun) return;
        if (theme === 'dark') {
            moon.style.display = 'none';
            sun.style.display = 'block';
        } else {
            moon.style.display = 'block';
            sun.style.display = 'none';
        }
    }

    const navLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');
    const currentPath = window.location.pathname.replace(/\/$/, '') || '/';

    navLinks.forEach(link => {
        const linkPath = new URL(link.href).pathname.replace(/\/$/, '') || '/';
        if (linkPath === currentPath) {
            link.classList.add('active');
        }
    });

    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const closeBtn = document.querySelector('.mobile-menu-close');

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => mobileMenu.classList.add('open'));
        closeBtn.addEventListener('click', () => mobileMenu.classList.remove('open'));
    }
});