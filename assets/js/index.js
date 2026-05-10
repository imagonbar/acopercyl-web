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

// Future: Dark Mode Toggle implementation
console.log('ACOPERCYL Web initialized.');
