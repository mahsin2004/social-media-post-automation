import axios from 'axios';
import SocialAccount from '../models/SocialAccount.js';

// Utility to build query strings
const toQueryString = obj => Object.entries(obj).map(([k,v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&');

// Kick off OAuth flow
export const connectPlatform = async (req, res, next) => {
  try {
    const { platform } = req.params;
    let authUrl = '';
    const state = `${Math.random().toString(36).substr(2)}_${req.user._id}`; // Include userId in state for callback

    if (platform === 'facebook') {
      const params = {
        client_id: process.env.FACEBOOK_CLIENT_ID,
        redirect_uri: process.env.FACEBOOK_REDIRECT_URI,
        state,
        scope: 'pages_show_list,instagram_basic,instagram_content_publish,pages_read_engagement,pages_manage_posts,pages_read_user_content,public_profile',
        response_type: 'code'
      };
      authUrl = `https://www.facebook.com/v17.0/dialog/oauth?${toQueryString(params)}`;

    } else if (platform === 'instagram') {
      // Instagram uses Facebook Graph API for Business accounts
      const params = {
        client_id: process.env.INSTAGRAM_CLIENT_ID,
        redirect_uri: process.env.INSTAGRAM_REDIRECT_URI,
        scope: 'instagram_basic,instagram_content_publish',
        response_type: 'code',
        state
      };
      authUrl = `https://api.instagram.com/oauth/authorize?${toQueryString(params)}`;

    } else if (platform === 'linkedin') {
      const params = {
        response_type: 'code',
        client_id: process.env.LINKEDIN_CLIENT_ID,
        redirect_uri: process.env.LINKEDIN_REDIRECT_URI,
        state,
        scope: 'r_liteprofile r_emailaddress w_member_social'
      };
      authUrl = `https://www.linkedin.com/oauth/v2/authorization?${toQueryString(params)}`;

    } else if (platform === 'twitter') {
      // Note: Twitter uses OAuth 2.0 authorization code with PKCE or OAuth1.0a
      const params = {
        response_type: 'code',
        client_id: process.env.TWITTER_CLIENT_ID,
        redirect_uri: process.env.TWITTER_REDIRECT_URI,
        scope: 'tweet.write users.read offline.access',
        state,
        code_challenge: 'challenge',  // you need to generate code_challenge for PKCE
        code_challenge_method: 'plain'
      };
      authUrl = `https://twitter.com/i/oauth2/authorize?${toQueryString(params)}`;
    } else if (platform === 'youtube') {
      const params = {
        client_id: process.env.YOUTUBE_CLIENT_ID,
        redirect_uri: process.env.YOUTUBE_REDIRECT_URI,
        state,
        scope: 'https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube.readonly',
        response_type: 'code',
        access_type: 'offline',
        prompt: 'consent'
      };
      authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${toQueryString(params)}`;
    } else if (platform === 'pinterest') {
      const params = {
        client_id: process.env.PINTEREST_CLIENT_ID,
        redirect_uri: process.env.PINTEREST_REDIRECT_URI,
        state,
        scope: 'boards:read,boards:write,pins:read,pins:write,user_accounts:read',
        response_type: 'code'
      };
      authUrl = `https://api.pinterest.com/oauth/?${toQueryString(params)}`;
    } else if (platform === 'tiktok') {
      const params = {
        client_key: process.env.TIKTOK_CLIENT_KEY,
        redirect_uri: process.env.TIKTOK_REDIRECT_URI,
        state,
        scope: 'user.info.basic,video.list,video.upload',
        response_type: 'code'
      };
      authUrl = `https://www.tiktok.com/auth/authorize?${toQueryString(params)}`;
    } else {
      return res.status(400).json({ message: 'Unsupported platform' });
    }

    // Optionally store state + userId in DB or session for CSRF check
    res.json({ authUrl });

  } catch (err) {
    next(err);
  }
};

// Callback handler
export const callbackPlatform = async (req, res, next) => {
  try {
    const { platform } = req.params;
    const { code, state } = req.query;
    const [randomString, userId] = state.split('_'); // Extract userId from state

    if (!code) {
      return res.status(400).json({ message: 'Authorization code missing' });
    }

    let tokenResponse;
    let accountId;
    let accessToken;
    let refreshToken = null;
    let expiresAt = null;
    let scopes = [];

    if (platform === 'facebook' || platform === 'instagram') {
      // Exchange code for token
      const tokenUrl = 'https://graph.facebook.com/v17.0/oauth/access_token';
      const params = {
        client_id: process.env.FACEBOOK_CLIENT_ID,
        client_secret: process.env.FACEBOOK_CLIENT_SECRET,
        redirect_uri: process.env.FACEBOOK_REDIRECT_URI,
        code
      };
      tokenResponse = await axios.get(`${tokenUrl}?${toQueryString(params)}`);
      accessToken = tokenResponse.data.access_token;
      expiresAt = new Date(Date.now() + tokenResponse.data.expires_in * 1000);
      scopes = tokenResponse.data.scope?.split(',') || [];

      // For Instagram Business account id
      if (platform === 'instagram') {
        const igUrl = `https://graph.facebook.com/v17.0/me/accounts?access_token=${accessToken}`;
        const igRes = await axios.get(igUrl);
        const page = igRes.data.data[0];
        accountId = page.id;
      } else {
        // Facebook user or page
        const meUrl = `https://graph.facebook.com/me?fields=id&access_token=${accessToken}`;
        const meRes = await axios.get(meUrl);
        const userAccountId = meRes.data.id;

        // Fetch pages for the user
        const pagesUrl = `https://graph.facebook.com/v17.0/${userAccountId}/accounts?access_token=${accessToken}`;
        const pagesRes = await axios.get(pagesUrl);
        const pages = pagesRes.data.data;

        if (pages && pages.length > 0) {
          req.session.facebookPages = pages;
          req.session.facebookUserAccessToken = accessToken; // Store user access token for later use
          return res.redirect(`${process.env.FRONTEND_URL}/dashboard/connect/facebook/pages`);
        } else {
          // If no pages, connect the user account directly
          accountId = userAccountId;
          // Save to DB
          const record = await SocialAccount.create({
            userId,
            platform: 'facebook',
            accountId,
            accessToken,
            refreshToken,
            expiresAt,
            scopes,
            connectedAt: new Date(),
            status: 'connected'
          });
          return res.redirect(`${process.env.FRONTEND_URL}/dashboard?status=success&platform=facebook`);
        }
      }

    } else if (platform === 'linkedin') {
      // Exchange code for token
      const tokenUrl = 'https://www.linkedin.com/oauth/v2/accessToken';
      const params = {
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.LINKEDIN_REDIRECT_URI,
        client_id: process.env.LINKEDIN_CLIENT_ID,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET
      };
      tokenResponse = await axios.post(tokenUrl, toQueryString(params), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      accessToken = tokenResponse.data.access_token;
      expiresAt = new Date(Date.now() + tokenResponse.data.expires_in * 1000);
      scopes = []; // LinkedIn returns scope maybe via another endpoint

      // Fetch profile for accountId
      const profileRes = await axios.get('https://api.linkedin.com/v2/me', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      accountId = profileRes.data.id;

    } else if (platform === 'twitter') {
      // Exchange code for token (OAuth2.0 PKCE)
      const tokenUrl = 'https://api.twitter.com/2/oauth2/token';
      const params = {
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.TWITTER_REDIRECT_URI,
        client_id: process.env.TWITTER_CLIENT_ID,
        code_verifier: 'verifier' // must match the challenge
      };
      tokenResponse = await axios.post(tokenUrl, toQueryString(params), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      accessToken = tokenResponse.data.access_token;
      refreshToken = tokenResponse.data.refresh_token;
      expiresAt = new Date(Date.now() + tokenResponse.data.expires_in * 1000);
      scopes = tokenResponse.data.scope?.split(' ') || [];

      // Get user ID
      const userRes = await axios.get('https://api.twitter.com/2/users/me', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      accountId = userRes.data.data.id;
    }
    else if (platform === 'youtube') {
      const tokenUrl = 'https://oauth2.googleapis.com/token';
      const params = {
        code,
        client_id: process.env.YOUTUBE_CLIENT_ID,
        client_secret: process.env.YOUTUBE_CLIENT_SECRET,
        redirect_uri: process.env.YOUTUBE_REDIRECT_URI,
        grant_type: 'authorization_code',
      };
      tokenResponse = await axios.post(tokenUrl, toQueryString(params), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      accessToken = tokenResponse.data.access_token;
      refreshToken = tokenResponse.data.refresh_token || null;
      expiresAt = new Date(Date.now() + tokenResponse.data.expires_in * 1000);
      scopes = tokenResponse.data.scope?.split(' ') || [];

      const profileRes = await axios.get('https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      accountId = profileRes.data.items[0].id;
    } else if (platform === 'pinterest') {
      const tokenUrl = 'https://api.pinterest.com/v5/oauth/token';
      const params = {
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.PINTEREST_REDIRECT_URI,
      };
      const auth = Buffer.from(`${process.env.PINTEREST_CLIENT_ID}:${process.env.PINTEREST_CLIENT_SECRET}`).toString('base64');
      tokenResponse = await axios.post(tokenUrl, toQueryString(params), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${auth}`,
        },
      });
      accessToken = tokenResponse.data.access_token;
      refreshToken = tokenResponse.data.refresh_token || null;
      expiresAt = new Date(Date.now() + tokenResponse.data.expires_in * 1000);
      scopes = tokenResponse.data.scope?.split(',') || [];

      const userRes = await axios.get('https://api.pinterest.com/v5/user_account', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      accountId = userRes.data.id;
    } else if (platform === 'tiktok') {
      const tokenUrl = 'https://open.tiktokapis.com/v2/oauth/token/';
      const params = {
        client_key: process.env.TIKTOK_CLIENT_KEY,
        client_secret: process.env.TIKTOK_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: process.env.TIKTOK_REDIRECT_URI,
      };
      tokenResponse = await axios.post(tokenUrl, params);
      accessToken = tokenResponse.data.access_token;
      refreshToken = tokenResponse.data.refresh_token || null;
      expiresAt = new Date(Date.now() + tokenResponse.data.expires_in * 1000);
      scopes = tokenResponse.data.scope?.split(',') || [];

      const userRes = await axios.post('https://open.tiktokapis.com/v2/user/info/', {
        fields: ['open_id', 'display_name', 'avatar_url'],
      }, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      accountId = userRes.data.data.user.open_id;
    }

    // Save to DB
    const record = await SocialAccount.create({
      userId,
      platform,
      accountId,
      accessToken,
      refreshToken,
      expiresAt,
      scopes,
      connectedAt: new Date(),
      status: 'connected'
    });

    res.json({ message: `${platform} connected successfully`, record });

  } catch (err) {
    next(err);
  }
};

export const getFacebookPages = async (req, res, next) => {
  try {
    if (!req.session.facebookPages) {
      return res.status(404).json({ message: 'No Facebook pages found in session.' });
    }
    res.json({ pages: req.session.facebookPages });
  } catch (err) {
    next(err);
  }
};

// Controller to handle selected Facebook page
export const selectFacebookPage = async (req, res, next) => {
  try {
    const { pageId, pageAccessToken, pagePerms } = req.body;
    const userId = req.user._id; // Assuming user is authenticated

    if (!pageId || !pageAccessToken) {
      return res.status(400).json({ message: 'Page ID and access token are required.' });
    }

    // Save to DB
    const record = await SocialAccount.create({
      userId,
      platform: 'facebook',
      accountId: pageId,
      accessToken: pageAccessToken,
      refreshToken: null, // Page access tokens typically don't have refresh tokens
      expiresAt: null, // Page access tokens are long-lived or permanent
      scopes: pagePerms,
      connectedAt: new Date(),
      status: 'connected'
    });

    // Clear session data after successful connection
    req.session.facebookPages = null;
    req.session.facebookUserAccessToken = null;

    res.json({ message: 'Facebook page connected successfully', record });

  } catch (err) {
    next(err);
  }
};

export const getConnectedPlatforms = async (req, res, next) => {
  try {
    // Assuming req.user._id is correctly set by an authentication middleware
    const userId = req.user._id; 
    
    // 1. Fetch all connected accounts for the user
    // Mongoose's .find() returns an array of documents (or plain objects if lean() is used)
    const connectedAccounts = await SocialAccount.find({ userId });

    // 2. Map the array to extract the required fields and structure
    const platforms = connectedAccounts.map(account => ({
      // Map the mongoose document fields to the new structure
      platform: account.platform,
      accountId: account.accountId,
      accessToken: account.accessToken, // Be cautious about exposing tokens; consider security implications
    }));

    // 3. Send the response with the desired array structure
    // Example output: [{platform: 'facebook', accountId: '12345', accessToken: 'EAA...'}]
    res.json(platforms); 
    
  } catch (err) {
    next(err);
  }
};
