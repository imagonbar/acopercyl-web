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

// Smooth Scroll: Ahora se gestiona nativamente vía CSS con scroll-padding-top para mayor fluidez.

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

// FAQ Accordion Logic
function initFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        const newQuestion = question.cloneNode(true);
        question.parentNode.replaceChild(newQuestion, question);
        
        newQuestion.addEventListener('click', () => {
            const item = newQuestion.parentElement;
            document.querySelectorAll('.faq-item').forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            item.classList.toggle('active');
        });
    });
}

// Data Loading Logic
async function loadSiteData() {
    const heroTitle = document.getElementById('hero-title');
    const heroText = document.getElementById('hero-text');
    const missionText = document.getElementById('about-mission');
    const visionText = document.getElementById('about-vision');
    const struggleText = document.getElementById('about-struggle');
    const faqContainer = document.getElementById('faq-accordion-container');

    try {
        const response = await fetch('content/site_data.json');
        const data = await response.json();
        
        // Populate Hero
        if (heroTitle && data.hero.title) heroTitle.textContent = data.hero.title;
        if (heroText && data.hero.text) heroText.textContent = data.hero.text;
        
        // Populate About Cards
        if (missionText && data.about.mission) missionText.textContent = data.about.mission;
        if (visionText && data.about.vision) visionText.textContent = data.about.vision;
        if (struggleText && data.about.struggle) struggleText.textContent = data.about.struggle;
        
        // Populate FAQ
        if (faqContainer && data.faq) {
            faqContainer.innerHTML = data.faq.map(item => `
                <div class="faq-item">
                    <button class="faq-question">${item.question}</button>
                    <div class="faq-answer">
                        <p>${item.answer.replace(/\n\n/g, '</p><p>')}</p>
                    </div>
                </div>
            `).join('');
            initFAQ();
        }
    } catch (error) {
        console.error('Error cargando datos del sitio:', error);
    }
}

// Inicializar carga al arrancar
document.addEventListener('DOMContentLoaded', loadSiteData);

// Cookie Banner Logic
const cookieBanner = document.getElementById('cookie-banner');
const acceptCookiesBtn = document.getElementById('accept-cookies');
const cookieSettingsBtn = document.getElementById('cookie-settings-btn');

if (!localStorage.getItem('cookiesAccepted')) {
    if (cookieBanner) cookieBanner.style.display = 'block';
}

if (acceptCookiesBtn) {
    acceptCookiesBtn.addEventListener('click', () => {
        localStorage.setItem('cookiesAccepted', 'true');
        cookieBanner.style.display = 'none';
    });
}

if (cookieSettingsBtn) {
    cookieSettingsBtn.addEventListener('click', () => {
        cookieBanner.style.display = 'block';
    });
}

console.log('ACOPERCYL Web initialized.');
