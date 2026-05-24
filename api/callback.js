/**
 * Serverless function to handle the GitHub OAuth callback for Decap CMS.
 * Exchanges the code for an access token and returns it using the Decap CMS handshake protocol.
 */
module.exports = async (req, res) => {
  const code = req.query.code;
  const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
  const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

  if (!code) {
    res.status(400).send("Error: No authorization code received from GitHub.");
    return;
  }

  if (!CLIENT_ID || !CLIENT_SECRET) {
    res.status(500).send("Error: GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET is not configured on Vercel.");
    return;
  }

  try {
    const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code
      }),
    });

    const data = await tokenResponse.json();
    
    if (data.error) {
      res.status(400).send(`Error de GitHub: ${data.error_description || data.error}`);
      return;
    }

    const access_token = data.access_token;

    if (!access_token) {
      res.status(400).send(`Error: No se pudo obtener el token de acceso. Respuesta: ${JSON.stringify(data)}`);
      return;
    }

    // Return the token using the Decap CMS handshake protocol (two-way postMessage)
    res.setHeader("Content-Type", "text/html");
    res.status(200).send(`
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>Autenticación Completada | ACOPERCYL</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            text-align: center;
            padding: 3rem;
            background: #f8fafc;
            color: #334155;
          }
          .spinner {
            border: 4px solid rgba(0,0,0,.1);
            width: 36px;
            height: 36px;
            border-radius: 50%;
            border-left-color: #0ea5e9;
            animation: spin 1s linear infinite;
            margin: 2rem auto;
          }
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        </style>
      </head>
      <body>
        <h2>Conectando con el CMS...</h2>
        <p>Iniciando sesión de forma segura. Esta ventana se cerrará automáticamente.</p>
        <div class="spinner"></div>
        
        <script>
          (function() {
            const tokenData = ${JSON.stringify({ token: access_token, provider: 'github' })};
            
            function receiveMessage(e) {
              // Send the success token message back to the CMS opener window
              window.opener.postMessage('authorization:github:success:' + JSON.stringify(tokenData), e.origin);
              // Close the popup window
              window.close();
            }
            
            // Listen for the reply from the CMS window to complete the handshake
            window.addEventListener("message", receiveMessage, false);
            
            // Start the handshake by telling the CMS opener we are ready
            window.opener.postMessage("authorizing:github", "*");
          })();
        </script>
      </body>
      </html>
    `);
  } catch (error) {
    res.status(500).send(`Error interno del servidor: ${error.message}`);
  }
};
