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

if (burgerBtn && mobileMenu) {
    burgerBtn.addEventListener('click', () => {
        mobileMenu.classList.add('active');
        mobileMenu.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        if (closeBtn) closeBtn.focus();
    });
}

const closeMenuFunc = () => {
    if (mobileMenu) {
        mobileMenu.classList.remove('active');
        mobileMenu.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = 'auto';
        if (burgerBtn) burgerBtn.focus();
    }
};

if (closeBtn) {
    closeBtn.addEventListener('click', closeMenuFunc);
}

// Close menu when any link inside the mobile menu is clicked
if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenuFunc);
    });
}

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
    const communityText = document.getElementById('community-text');
    const privacyContent = document.getElementById('privacy-dynamic-content');
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

        // Populate Community
        if (communityText && data.community.text) communityText.textContent = data.community.text;

        // Populate Privacy Policy (Simple Markdown to HTML)
        if (privacyContent && data.privacy.content) {
            privacyContent.innerHTML = data.privacy.content
                .replace(/^### (.*$)/gim, '<h3>$1</h3>')
                .replace(/^## (.*$)/gim, '<h2>$1</h2>')
                .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
                .replace(/\n/gim, '<br>');
        }
        
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

        // Populate Objectives
        const objectivesContainer = document.getElementById('objectives-container');
        if (objectivesContainer && data.objectives) {
            objectivesContainer.innerHTML = data.objectives.map(obj => `
                <div class="card">
                    <span style="font-size: 2.5rem;">${obj.icon}</span>
                    <h3>${obj.title}</h3>
                    <p>${obj.text}</p>
                </div>
            `).join('');
        }

        // Populate Symptoms
        const symptomsContainer = document.getElementById('symptoms-container');
        if (symptomsContainer && data.symptoms) {
            symptomsContainer.innerHTML = data.symptoms.map(sym => `
                <div class="card">
                    <span style="font-size: 2rem;">${sym.icon}</span>
                    <h4>${sym.title}</h4>
                    <p>${sym.text}</p>
                </div>
            `).join('');
        }

        // Populate Social Media Cards
        const socialCardsContainer = document.getElementById('social-cards-container');
        if (socialCardsContainer && data.social) {
            const socialMap = [
                { id: 'instagram', label: 'Instagram', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>' },
                { id: 'x', label: 'X (Twitter)', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4l11.733 16h4.267l-11.733-16zM4 20l6.768-6.768m2.46-2.46L20 4"></path></svg>' },
                { id: 'facebook', label: 'Facebook', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>' }
            ];

            socialCardsContainer.innerHTML = socialMap.map(s => `
                <a href="${data.social[s.id]}" target="_blank" class="social-card" aria-label="${s.label}">
                    <div class="social-icon-wrapper">${s.icon}</div>
                    <span class="social-label">${s.label}</span>
                </a>
            `).join('');
        }

        // Update Footer Social and Info
        if (data.social) {
            const footerSocials = document.querySelectorAll('.footer-social-icons a');
            footerSocials.forEach(a => {
                const label = a.getAttribute('aria-label').toLowerCase();
                if (label.includes('instagram')) a.href = data.social.instagram;
                if (label.includes('x')) a.href = data.social.x;
                if (label.includes('facebook')) a.href = data.social.facebook;
            });
        }

        const footerText = document.getElementById('footer-brand-text');
        if (footerText && data.contact.footer_text) footerText.textContent = data.contact.footer_text;

        const footerEmail = document.getElementById('footer-email');
        if (footerEmail && data.contact.email) {
            footerEmail.href = `mailto:${data.contact.email}`;
            footerEmail.textContent = data.contact.email;
        }

        const footerLocation = document.getElementById('footer-location');
        if (footerLocation && data.contact.location) footerLocation.textContent = data.contact.location;

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

// Scroll Progress Bar Logic
window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    const progressContainer = document.getElementById("scroll-progress");
    if (progressContainer) {
        progressContainer.style.width = scrolled + "%";
    }
});

if (cookieSettingsBtn) {
    cookieSettingsBtn.addEventListener('click', () => {
        cookieBanner.style.display = 'block';
    });
}

// Formspree AJAX Submission
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.querySelector('.contact-form');
    const contactCard = document.getElementById('contact-form-card');
    const formStatus = document.getElementById('form-status');
    const submitBtn = document.getElementById('submit-btn');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Deshabilitar botón
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Enviando...';
            }

            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    if (contactCard) contactCard.style.display = 'none';
                    if (formStatus) formStatus.className = 'form-status-visible';
                    contactForm.reset();
                } else {
                    const errorData = await response.json();
                    console.error('Error de Formspree:', errorData);
                    alert('Hubo un problema al enviar el mensaje. Por favor, asegúrate de que el formulario está activo en Formspree.');
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.textContent = 'Enviar Mensaje';
                    }
                }
            } catch (error) {
                console.error('Error de conexión:', error);
                alert('Error de conexión. Por favor, revisa tu internet e inténtalo de nuevo.');
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Enviar Mensaje';
                }
            }
        });
    }

    // Reset Form Function
    window.resetForm = function () {
        if (contactCard) contactCard.style.display = 'block';
        if (formStatus) formStatus.className = 'form-status-hidden';
    };
});


console.log(`
%c   _   ___ ___  _____  _______   __ _ 
  /_\ / __/ _ \| _ \ __| _ \ \ / /| |
 / _ \ (_| (_) |  _/ _||   /\ V / | |__
/_/ \_\___\___/|_| |___|_|_\\|_|  |____|
                                        
%c🚀 ACOPERCYL Web v1.0 - ¡Dando voz al silencio!
🛠️ Desarrollado por GONBAR SOLUTIONS
`, "color: #118a67; font-weight: bold; font-family: monospace; font-size: 12px;", "color: #4a454a; font-family: sans-serif; font-size: 14px;");
