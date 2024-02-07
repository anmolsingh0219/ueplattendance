// src/utils/authUtils.js
const refreshAccessToken = async () => {
    const tokenEndpoint = 'https://oauth2.googleapis.com/token';
    const payload = {
      client_id: "115381404024-j4bi9p94iarcutrv7o896fpieevq1k2f.apps.googleusercontent.com",
      client_secret: "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",
      refresh_token: localStorage.getItem('refresh_token'),
      grant_type: 'refresh_token',
    };
    try {
      const response = await fetch(tokenEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(payload),
      });
      const data = await response.json();
      if (response.ok) {
        const expiresAt = new Date(new Date().getTime() + data.expires_in * 1000);
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('expires_at', expiresAt.toISOString()); // Update expiry time
      } else {
        throw new Error(data.error || 'Refresh token exchange was not successful.');
      }
    } catch (error) {
      console.error('Error during access token refresh:', error);
      // Handle token refresh errors, e.g., by logging out the user
    }
  };
  export default refreshAccessToken;
  