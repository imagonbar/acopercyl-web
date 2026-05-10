// Header Scroll Effect
const header = document.querySelector('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.style.padding = '10px 0';
        header.style.boxShadow = 'var(--shadow-md)';
        header.classList.add('glass');
    } else {
        header.style.padding = '20px 0';
        header.style.boxShadow = 'none';
    }
});

// Smooth Scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Mobile Menu Logic
const burgerBtn = document.getElementById('burger-btn');
const closeBtn = document.getElementById('close-btn');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

burgerBtn.addEventListener('click', () => {
    mobileMenu.classList.add('active');
    mobileMenu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeBtn.focus(); // Mejora de accesibilidad: pone el foco en el botón de cerrar
});

const closeMenuFunc = () => {
    mobileMenu.classList.remove('active');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = 'auto';
    burgerBtn.focus(); // Devuelve el foco al botón de hamburguesa
};

closeBtn.addEventListener('click', closeMenuFunc);

// Close menu when a link is clicked
mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenuFunc);
});

console.log('ACOPERCYL Web initialized.');
