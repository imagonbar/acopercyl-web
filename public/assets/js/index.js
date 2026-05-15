// --- VARIABLES GLOBALES ---
let allNews = [];
let newsVisible = 3; // Solo 3 para la home

// --- CARGA DE DATOS PRINCIPAL ---
async function loadSiteData() {
    const newsContainer = document.getElementById('news-container');
    
    try {
        console.log('[Sistema] Iniciando carga de datos...');
        
        // Intentar cargar el JSON (ruta relativa para compatibilidad local)
        const response = await fetch('content/site_data.json');
        if (!response.ok) throw new Error('No se pudo cargar site_data.json (Error: ' + response.status + ')');
        
        const data = await response.json();
        console.log('[Sistema] JSON cargado correctamente:', data);

        // 1. Noticias (Prioridad)
        if (data.news && data.news.length > 0) {
            allNews = data.news;
            renderNews();
        } else {
            if (newsContainer) newsContainer.innerHTML = '<p style="text-align:center; grid-column: 1/-1; opacity: 0.6;">No hay noticias registradas en el JSON.</p>';
        }

        // 2. Hero Section
        const heroTitle = document.getElementById('hero-title');
        const heroText = document.getElementById('hero-text');
        if (heroTitle && data.hero?.title) heroTitle.textContent = data.hero.title;
        if (heroText && data.hero?.text) heroText.textContent = data.hero.text;
        
        // 3. Nosotros (About)
        const missionText = document.getElementById('about-mission');
        const visionText = document.getElementById('about-vision');
        const struggleText = document.getElementById('about-struggle');
        if (missionText && data.about?.mission) missionText.textContent = data.about.mission;
        if (visionText && data.about?.vision) visionText.textContent = data.about.vision;
        if (struggleText && data.about?.struggle) struggleText.textContent = data.about.struggle;

        // 4. Objetivos y Síntomas
        renderListCards('objectives-container', data.objectives);
        renderListCards('symptoms-container', data.symptoms);

        // 5. FAQ (Restaurado a diseño original)
        const faqContainer = document.getElementById('faq-accordion-container');
        if (faqContainer && data.faq) {
            faqContainer.innerHTML = data.faq.map(item => `
                <div class="faq-item">
                    <button class="faq-question">${item.question}</button>
                    <div class="faq-answer">
                        <p>${item.answer.replace(/\n/g, '<br>')}</p>
                    </div>
                </div>
            `).join('');
            
            // Re-vincular lógica original de FAQ
            const faqQuestions = faqContainer.querySelectorAll('.faq-question');
            faqQuestions.forEach(question => {
                question.addEventListener('click', () => {
                    const item = question.parentElement;
                    document.querySelectorAll('.faq-item').forEach(other => {
                        if (other !== item) other.classList.remove('active');
                    });
                    item.classList.toggle('active');
                });
            });
        }

        // 6. Comunidad y Redes Sociales
        renderSocialSection(data.social);

        // 7. Política de Privacidad
        const privacyContent = document.getElementById('privacy-dynamic-content');
        if (privacyContent && data.privacy?.content) {
            privacyContent.innerHTML = data.privacy.content
                .replace(/^### (.*$)/gim, '<h3>$1</h3>')
                .replace(/^## (.*$)/gim, '<h2>$1</h2>')
                .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
                .replace(/\n/gim, '<br>');
        }

        // 8. Footer Info
        const footerEmail = document.getElementById('footer-email');
        if (footerEmail && data.contact?.email) {
            footerEmail.href = `mailto:${data.contact.email}`;
            footerEmail.textContent = data.contact.email;
        }
        const footerLocation = document.getElementById('footer-location');
        if (footerLocation && data.contact?.location) footerLocation.textContent = data.contact.location;
        const footerBrandText = document.getElementById('footer-brand-text');
        if (footerBrandText && data.contact?.footer_text) footerBrandText.textContent = data.contact.footer_text;

    } catch (error) {
        console.error('[Sistema] Error Crítico:', error);
        if (newsContainer) {
            newsContainer.innerHTML = `
                <div style="grid-column: 1/-1; text-align:center; padding: 3rem; background: #fff1f1; border: 2px dashed #ff000033; border-radius: 15px;">
                    <p style="color: #d32f2f; font-weight: bold; margin-bottom: 1rem;">⚠️ Error al cargar el contenido</p>
                    <code style="display: block; background: #0000000a; padding: 1rem; border-radius: 5px; font-size: 0.9rem;">${error.message}</code>
                    <p style="margin-top: 1rem; font-size: 0.85rem; opacity: 0.7;">Prueba a recargar con Ctrl + F5 o verifica que el archivo site_data.json existe en /public/content/</p>
                </div>`;
        }
    }
}

// --- FUNCIONES AUXILIARES ---

function renderNews() {
    const container = document.getElementById('news-container');
    const actions = document.getElementById('news-actions');
    if (!container) return;

    const sorted = [...allNews].sort((a, b) => new Date(b.date) - new Date(a.date));
    const slice = sorted.slice(0, newsVisible);
    
    container.innerHTML = slice.map(item => `
        <article class="news-card">
            <div class="news-image-container ${!item.image ? 'no-image' : ''}">
                <img src="${item.image || '/assets/img/logo.png'}" alt="${item.title}" class="news-image" onerror="this.src='/assets/img/logo.png'">
            </div>
            <div class="news-body">
                <div class="news-meta">
                    <span class="news-date">${new Date(item.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    ${item.source ? `<span class="news-source">| ${item.source}</span>` : ''}
                </div>
                <h3>${item.title}</h3>
                <a href="${item.url}" target="_blank" class="btn-news">
                    Leer noticia 
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </a>
            </div>
        </article>
    `).join('');

    if (actions) actions.style.display = (newsVisible < sorted.length) ? 'flex' : 'none';
}

function renderListCards(id, items) {
    const container = document.getElementById(id);
    if (!container || !items) return;
    container.innerHTML = items.map(item => `
        <div class="card">
            <span style="font-size: 2.5rem; margin-bottom: 1rem; display: block;">${item.icon}</span>
            <h3>${item.title}</h3>
            <p>${item.text}</p>
        </div>
    `).join('');
}

function renderSocialSection(social) {
    const container = document.getElementById('social-cards-container');
    if (!container || !social) return;

    const config = [
        { id: 'instagram', label: 'Instagram', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>' },
        { id: 'x', label: 'X (Twitter)', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4l11.733 16h4.267l-11.733-16zM4 20l6.768-6.768m2.46-2.46L20 4"></path></svg>' },
        { id: 'facebook', label: 'Facebook', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>' }
    ];

    container.innerHTML = config.map(s => `
        <a href="${social[s.id]}" target="_blank" class="social-card" aria-label="${s.label}">
            <div class="social-icon-wrapper">${s.icon}</div>
            <span class="social-label">${s.label}</span>
        </a>
    `).join('');
}

function setupFAQEvents() {
    const questions = document.querySelectorAll('.faq-question');
    questions.forEach(q => {
        q.addEventListener('click', () => {
            const isOpen = q.getAttribute('aria-expanded') === 'true';
            questions.forEach(other => {
                other.setAttribute('aria-expanded', 'false');
                other.nextElementSibling.style.maxHeight = null;
                other.querySelector('.faq-icon').textContent = '+';
            });
            if (!isOpen) {
                q.setAttribute('aria-expanded', 'true');
                const ans = q.nextElementSibling;
                ans.style.maxHeight = ans.scrollHeight + "px";
                q.querySelector('.faq-icon').textContent = '-';
            }
        });
    });
}

// --- EVENTOS DE INTERFAZ ---
document.addEventListener('DOMContentLoaded', () => {
    loadSiteData();

    // Ver más noticias
    const btnLoadMore = document.getElementById('btn-load-more');
    if (btnLoadMore) {
        btnLoadMore.addEventListener('click', () => {
            newsVisible += 6;
            renderNews();
        });
    }

    // Header & Scroll Progress
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        // Progress Bar
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        const progress = document.getElementById("scroll-progress");
        if (progress) progress.style.width = scrolled + "%";

        // Header Sticky
        if (header) {
            if (window.scrollY > 50) {
                header.classList.add('header-scrolled');
            } else {
                header.classList.remove('header-scrolled');
            }
        }
    });

    // Mobile Menu
    const burger = document.getElementById('burger-btn');
    const close = document.getElementById('close-btn');
    const menu = document.getElementById('mobile-menu');

    if (burger && menu) {
        burger.addEventListener('click', () => {
            menu.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    if (close && menu) {
        close.addEventListener('click', () => {
            menu.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    }

    document.querySelectorAll('.mobile-nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            menu?.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });
});

console.log("%c🚀 ACOPERCYL v2.0 - News System Active", "color: #1f9094; font-weight: bold; font-size: 14px;");
