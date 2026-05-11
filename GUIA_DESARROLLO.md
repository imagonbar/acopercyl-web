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

### Paso 2: Levantar el Servidor del CMS (Local)
Para poder usar el panel de administración en tu ordenador y que los cambios se guarden en tus archivos locales, necesitas este proxy:
```bash
npx decap-server
```
*   **Acceso**: `http://localhost:5173/admin/`

---

## 📝 2. Gestión de Contenidos (CMS)

### Opción A: Cambios en Producción (Recomendado)
No necesitas abrir el terminal ni programas de código.
1.  Entra en: `https://acopercyl.org/admin/`
2.  Identifícate con tu usuario.
3.  Edita los textos o imágenes y pulsa **Publish**.
4.  Netlify desplegará los cambios automáticamente en ~2 minutos.

### Opción B: Cambios en Local
Si quieres probar nuevas estructuras o grandes bloques de texto:
1.  Ten los dos comandos anteriores (`npm run dev` y `npx decap-server`) funcionando.
2.  Entra en `http://localhost:5173/admin/`.
3.  Los cambios se guardarán directamente en el archivo `public/content/site_data.json`.

---

## 🌐 3. Publicación de Código (Git)

Cuando hagas cambios en archivos `.html`, `.css` o `.js`, debes subirlos a GitHub para que se vean en la web oficial:

1.  **Guardar cambios**:
    ```bash
    git add .
    git commit -m "Explicación breve del cambio (ej: fix color botón)"
    ```

2.  **Subir a Producción**:
    ```bash
    git push origin main
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

*Guía generada el 12 de mayo de 2026. ¡Dando voz al silencio!*
