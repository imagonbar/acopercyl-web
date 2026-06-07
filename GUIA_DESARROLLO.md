# 🚀 Guía de Desarrollo - ACOPERCYL Web

Esta guía explica cómo gestionar el proyecto tanto para cambios de contenido como para mantenimiento del código.

---

## 🛠️ 1. Entorno de Desarrollo Local

Si necesitas realizar cambios en el código o probar el CMS antes de publicarlo, sigue estos pasos:

### Paso 1: Levantar el servidor de la Web
Este comando arranca el motor de la web (Vite) para que puedas ver los cambios en tiempo real.
```bash
npm run dev
```
*   **Acceso**: `http://localhost:5173`

### Paso 2: Probar el CMS (Local)
Sveltia CMS no requiere ejecutar servidores proxy o comandos adicionales en segundo plano.
1. Abre tu navegador (Chrome o Edge) en `http://localhost:5173/admin/`.
2. El CMS detectará que estás en local y te pedirá **seleccionar la carpeta del proyecto** (`c:\laragon\www\COVID Persistente web`).
3. Concede permisos de lectura y escritura en el popup del navegador.
4. Los cambios se guardarán directamente en tu archivo local `public/content/site_data.json`.

---

## 📝 2. Gestión de Contenidos (CMS en Producción)

Cualquier colaborador autorizado puede gestionar el contenido directamente online sin abrir la terminal:
1.  Entra en: `https://www.acopercyl.org/admin/`
2.  Identifícate con tu cuenta de GitHub (debe tener permisos de colaborador en el repositorio).
3.  Edita los textos o las noticias en el panel unificado y pulsa **Publish/Publicar**.
4.  **Automatización:** Al publicar, un bot de GitHub Actions completará automáticamente las imágenes y datos de portada de los nuevos enlaces y Vercel desplegará los cambios en ~1 minuto.

---

## 🌿 3. Control de Versiones y Ramas (Git)

Para mantener el código organizado y evitar conflictos en la rama principal (`main`), nos acostumbraremos a trabajar con **ramas de desarrollo** para nuevos cambios y mejoras:

### Paso 1: Crear una rama de trabajo
Antes de empezar una mejora, asegúrate de estar en `main` actualizado y crea una nueva rama descriptiva:
```bash
git checkout main
git pull
git checkout -b feature/nombre-de-la-mejora
```
*(Ejemplos de nombres: `feature/mejora-buscador`, `fix/correccion-contacto`)*

### Paso 2: Guardar los cambios localmente
A medida que realices cambios en los archivos, haz commits en tu rama:
```bash
git add .
git commit -m "Explicación clara del cambio realizado"
```

### Paso 3: Subir la rama y fusionar
Una vez terminados y probados los cambios localmente:
1. Sube tu rama a GitHub:
   ```bash
   git push origin feature/nombre-de-la-mejora
   ```
2. Entra en tu repositorio en GitHub y crea un **Pull Request (PR)** para revisar los cambios antes de fusionarlos a `main`, o fusiónalos tú mismo si todo está correcto.
3. Vuelve a tu rama local `main` y actualízala:
   ```bash
   git checkout main
   git pull
   ```

---

## 📧 4. Configuración de Formspree (Formulario)

Si el formulario de contacto deja de funcionar:
1.  Verifica que el ID en `index.html` (`action="https://formspree.io/f/xnjwowrr"`) sea el correcto.
2.  Asegúrate de que en el panel de **Formspree.io**, el reCAPTCHA esté **DESACTIVADO** para permitir el envío por AJAX.

---

## 🎨 5. Colores Corporativos
*   **Principal (Long COVID Teal)**: `#1f9094`
*   **Fondo Claro**: `#f8fcfb`
*   **Texto Principal**: `#1f1c1f`

---

*Guía actualizada en junio de 2026. ¡Dando voz al silencio!*
