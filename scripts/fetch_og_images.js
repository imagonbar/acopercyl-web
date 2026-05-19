const fs = require('fs');
const path = require('path');

const JSON_PATH = path.join(__dirname, '../public/content/site_data.json');

// Decodificador de entidades HTML básicas (ej. &amp; -> &)
function decodeHtmlEntities(str) {
    return str
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
        .replace(/&#x2F;/g, '/');
}

// Función para descargar el HTML y buscar la etiqueta og:image
async function fetchOgImage(url) {
    try {
        console.log(`[Scraper] Conectando a: ${url}`);
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            },
            signal: AbortSignal.timeout(12000) // 12s de tiempo de espera máximo
        });

        if (!response.ok) {
            console.log(`[Scraper] ⚠️ Error de respuesta HTTP: ${response.status} ${response.statusText}`);
            return null;
        }

        const html = await response.text();

        // 1. Intentar buscar og:image (patrón estándar)
        let match = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i);
        if (match) return decodeHtmlEntities(match[1]);

        // Alternativo: content antes de property
        match = html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i);
        if (match) return decodeHtmlEntities(match[1]);

        // 2. Intentar buscar twitter:image (Plan B)
        match = html.match(/<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i);
        if (match) return decodeHtmlEntities(match[1]);

        // Alternativo: content antes de name
        match = html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']twitter:image["']/i);
        if (match) return decodeHtmlEntities(match[1]);

        // 3. Intentar buscar itemprop="image" (Plan C)
        match = html.match(/<meta[^>]*itemprop=["']image["'][^>]*content=["']([^"']+)["']/i);
        if (match) return decodeHtmlEntities(match[1]);

        return null;
    } catch (error) {
        console.log(`[Scraper] ❌ Error de conexión: ${error.message}`);
        return null;
    }
}

async function main() {
    console.log('[Sistema] Iniciando extractor automático de imágenes Open Graph...');

    if (!fs.existsSync(JSON_PATH)) {
        console.error(`[Error] No se pudo encontrar el archivo de datos: ${JSON_PATH}`);
        process.exit(1);
    }

    const dataRaw = fs.readFileSync(JSON_PATH, 'utf8');
    let data;
    try {
        data = JSON.parse(dataRaw);
    } catch (e) {
        console.error('[Error] El archivo JSON contiene errores de sintaxis:', e.message);
        process.exit(1);
    }

    if (!data.news || !Array.isArray(data.news)) {
        console.log('[Sistema] No se encontraron noticias a procesar.');
        return;
    }

    let updatedCount = 0;

    for (let i = 0; i < data.news.length; i++) {
        const item = data.news[i];
        
        // Comprobar si no tiene imagen asignada
        const hasImage = item.image && item.image.trim().length > 0;
        
        if (!hasImage && item.url) {
            console.log(`\n[Noticia ${i + 1}/${data.news.length}] "${item.title || 'Sin Título'}"`);
            const ogImage = await fetchOgImage(item.url);
            
            if (ogImage) {
                let finalImage = ogImage;
                
                // Si la URL es relativa, resolverla con la del dominio origen
                if (ogImage.startsWith('/')) {
                    try {
                        const parsedUrl = new URL(item.url);
                        finalImage = `${parsedUrl.protocol}//${parsedUrl.host}${ogImage}`;
                    } catch (e) {
                        // Ignorar error al parsear URL
                    }
                }
                
                item.image = finalImage;
                console.log(`[Scraper]   ✅ Imagen encontrada: ${finalImage}`);
                updatedCount++;
            } else {
                console.log(`[Scraper]   ⚠️ No se pudo extraer la imagen del enlace.`);
                // Asegurar que existe la propiedad como string vacía para consistencia del CMS
                item.image = "";
            }
        }
    }

    if (updatedCount > 0) {
        // Escribimos de vuelta al JSON respetando la sangría de 2 espacios
        fs.writeFileSync(JSON_PATH, JSON.stringify(data, null, 2), 'utf8');
        console.log(`\n[Éxito] Proceso terminado. Se actualizaron ${updatedCount} noticias.`);
    } else {
        console.log('\n[Sistema] Todas las noticias ya disponen de imagen. No hay cambios pendientes.');
    }
}

main();
