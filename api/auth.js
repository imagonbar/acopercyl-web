/**
 * Serverless function to initiate the GitHub OAuth flow for Decap CMS.
 * Redirects the user to GitHub's authorization page.
 */
module.exports = (req, res) => {
  const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
  
  if (!CLIENT_ID) {
    res.status(500).send("Error: GITHUB_CLIENT_ID is not configured on Vercel.");
    return;
  }

  // Construct the redirect URI dynamically if not set
  const redirectUri = process.env.REDIRECT_URI || `https://${req.headers.host}/api/callback`;
  const authURL = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=repo,user`;
  
  res.writeHead(307, { Location: authURL });
  res.end();
};
