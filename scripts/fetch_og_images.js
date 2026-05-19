const fs = require('fs');
const path = require('path');

const JSON_PATH = path.join(__dirname, '../public/content/site_data.json');

// Decodificador de entidades HTML básicas comunes en metadatos
function decodeHtmlEntities(str) {
    if (!str) return '';
    const entities = {
        '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#039;': "'", '&#x2F;': '/',
        '&ldquo;': '«', '&rdquo;': '»', '&laquo;': '«', '&raquo;': '»', '&nbsp;': ' ',
        '&aacute;': 'á', '&eacute;': 'é', '&iacute;': 'í', '&oacute;': 'ó', '&uacute;': 'ú',
        '&Aacute;': 'Á', '&Eacute;': 'É', '&Iacute;': 'Í', '&Oacute;': 'Ó', '&Uacute;': 'Ú',
        '&ntilde;': 'ñ', '&Ntilde;': 'Ñ', '&uuml;': 'ü', '&Uuml;': 'Ü',
        '&#241;': 'ñ', '&#209;': 'Ñ', '&#225;': 'á', '&#233;': 'é', '&#237;': 'í', '&#243;': 'ó', '&#250;': 'ú',
        '&#193;': 'Á', '&#201;': 'É', '&#205;': 'Í', '&#211;': 'Ó', '&#218;': 'Ú'
    };
    return str.replace(/&[#\w\d]+;/g, (match) => entities[match] || match);
}

// Función para descargar el HTML y extraer metadatos
async function fetchMetadata(url) {
    try {
        console.log(`[Scraper] Conectando a: ${url}`);
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            },
            signal: AbortSignal.timeout(12000) // 12s timeout
        });

        if (!response.ok) {
            console.log(`[Scraper] ⚠️ Error de respuesta HTTP: ${response.status} ${response.statusText}`);
            return null;
        }

        const html = await response.text();

        // 1. EXTRAER TÍTULO (og:title -> title tag)
        let title = null;
        let match = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i);
        if (match) title = decodeHtmlEntities(match[1]);
        if (!title) {
            match = html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:title["']/i);
            if (match) title = decodeHtmlEntities(match[1]);
        }
        if (!title) {
            match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
            if (match) title = decodeHtmlEntities(match[1]);
        }
        if (title) title = title.trim();

        // 2. EXTRAER IMAGEN (og:image -> twitter:image -> itemprop="image")
        let image = null;
        match = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i);
        if (match) image = decodeHtmlEntities(match[1]);
        if (!image) {
            match = html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i);
            if (match) image = decodeHtmlEntities(match[1]);
        }
        if (!image) {
            match = html.match(/<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i);
            if (match) image = decodeHtmlEntities(match[1]);
        }
        if (image) {
            image = image.trim();
            // Resolver URLs relativas
            if (image.startsWith('/')) {
                try {
                    const parsedUrl = new URL(url);
                    image = `${parsedUrl.protocol}//${parsedUrl.host}${image}`;
                } catch (e) {}
            }
        }

        // 3. EXTRAER FUENTE/SITIO (og:site_name -> hostname)
        let source = null;
        match = html.match(/<meta[^>]*property=["']og:site_name["'][^>]*content=["']([^"']+)["']/i);
        if (match) source = decodeHtmlEntities(match[1]);
        if (!source) {
            match = html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:site_name["']/i);
            if (match) source = decodeHtmlEntities(match[1]);
        }
        if (!source) {
            try {
                const parsed = new URL(url);
                const hostParts = parsed.hostname.replace('www.', '').split('.');
                if (hostParts.length > 0) {
                    source = hostParts[0].charAt(0).toUpperCase() + hostParts[0].slice(1);
                }
            } catch (e) {}
        }
        if (source) source = source.trim();

        // 4. EXTRAER FECHA (article:published_time -> pubdate -> date -> today)
        let date = null;
        match = html.match(/<meta[^>]*property=["']article:published_time["'][^>]*content=["']([^"']+)["']/i);
        if (match) date = match[1];
        if (!date) {
            match = html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']article:published_time["']/i);
            if (match) date = match[1];
        }
        if (!date) {
            match = html.match(/<meta[^>]*name=["']pubdate["'][^>]*content=["']([^"']+)["']/i);
            if (match) date = match[1];
        }
        if (!date) {
            match = html.match(/<meta[^>]*name=["']date["'][^>]*content=["']([^"']+)["']/i);
            if (match) date = match[1];
        }
        
        if (date) {
            const dateMatch = date.match(/(\d{4}-\d{2}-\d{2})/);
            if (dateMatch) {
                date = dateMatch[1];
            } else {
                date = null;
            }
        }
        if (!date) {
            date = new Date().toISOString().split('T')[0]; // fallback fecha hoy
        }

        return { title, image, source, date };
    } catch (error) {
        console.log(`[Scraper] ❌ Error de conexión: ${error.message}`);
        return null;
    }
}

async function main() {
    console.log('[Sistema] Iniciando autocompletador inteligente de metadatos de noticias...');

    if (!fs.existsSync(JSON_PATH)) {
        console.error(`[Error] No se encontró el archivo de datos: ${JSON_PATH}`);
        process.exit(1);
    }

    const dataRaw = fs.readFileSync(JSON_PATH, 'utf8');
    let data;
    try {
        data = JSON.parse(dataRaw);
    } catch (e) {
        console.error('[Error] El JSON contiene errores de sintaxis:', e.message);
        process.exit(1);
    }

    if (!data.news || !Array.isArray(data.news)) {
        console.log('[Sistema] No hay noticias para procesar.');
        return;
    }

    let updatedCount = 0;

    for (let i = 0; i < data.news.length; i++) {
        const item = data.news[i];
        
        // Si no tiene URL, la saltamos
        if (!item.url || item.url.trim().length === 0) continue;

        // Comprobamos qué campos están vacíos
        const hasTitle = item.title && item.title.trim().length > 0;
        const hasImage = item.image && item.image.trim().length > 0;
        const hasSource = item.source && item.source.trim().length > 0;
        const hasDate = item.date && item.date.trim().length > 0;

        // Si falta cualquier dato, lo autocompletamos con la URL
        if (!hasTitle || !hasImage || !hasSource || !hasDate) {
            console.log(`\n[Noticia ${i + 1}/${data.news.length}] Extrayendo datos de: ${item.url}`);
            const meta = await fetchMetadata(item.url);

            if (meta) {
                let changed = false;

                if (!hasTitle && meta.title) {
                    item.title = meta.title;
                    console.log(`[Scraper]   ✅ Título autocompletado: "${meta.title}"`);
                    changed = true;
                }

                if (!hasImage && meta.image) {
                    item.image = meta.image;
                    console.log(`[Scraper]   ✅ Imagen autocompletada: ${meta.image}`);
                    changed = true;
                } else if (!hasImage && !item.image) {
                    item.image = ""; // Inicializar
                }

                if (!hasSource && meta.source) {
                    item.source = meta.source;
                    console.log(`[Scraper]   ✅ Fuente autocompletada: "${meta.source}"`);
                    changed = true;
                }

                if (!hasDate && meta.date) {
                    item.date = meta.date;
                    console.log(`[Scraper]   ✅ Fecha autocompletada: ${meta.date}`);
                    changed = true;
                }

                if (changed) updatedCount++;
            } else {
                console.log(`[Scraper]   ⚠️ No se pudieron obtener metadatos. Asignando valores por defecto.`);
                let defaultChanged = false;
                
                if (!item.title) {
                    item.title = "Noticia compartida";
                    defaultChanged = true;
                }
                if (!item.image) {
                    item.image = "";
                    defaultChanged = true;
                }
                if (!item.source) {
                    try {
                        const parsed = new URL(item.url);
                        item.source = parsed.hostname.replace('www.', '');
                    } catch (e) {
                        item.source = "Prensa";
                    }
                    defaultChanged = true;
                }
                if (!item.date) {
                    item.date = new Date().toISOString().split('T')[0];
                    defaultChanged = true;
                }

                if (defaultChanged) updatedCount++;
            }
        }
    }

    if (updatedCount > 0) {
        fs.writeFileSync(JSON_PATH, JSON.stringify(data, null, 2), 'utf8');
        console.log(`\n[Éxito] Proceso terminado. Se autocompletaron metadatos en ${updatedCount} noticias.`);
    } else {
        console.log('\n[Sistema] Todas las noticias disponen de todos sus metadatos. No hay cambios pendientes.');
    }
}

main();
