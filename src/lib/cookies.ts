// Cookie utility functions for authentication

const TOKEN_COOKIE = 'auth_token';
const USER_COOKIE = 'user_info';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export const setCookie = (name: string, value: string, maxAge = COOKIE_MAX_AGE) => {
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}`;
};

export const getCookie = (name: string): string | null => {
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [cookieName, cookieValue] = cookie.trim().split('=');
    if (cookieName === name) {
      return cookieValue;
    }
  }
  return null;
};

export const removeCookie = (name: string) => {
  document.cookie = `${name}=; path=/; max-age=0`;
};

// Authentication specific cookie functions
export const setAuthToken = (token: string) => {
  setCookie(TOKEN_COOKIE, token);
};

export const getAuthToken = (): string | null => {
  return getCookie(TOKEN_COOKIE);
};

export const removeAuthToken = () => {
  removeCookie(TOKEN_COOKIE);
};

export const setUserInfo = (userInfo: object) => {
  setCookie(USER_COOKIE, JSON.stringify(userInfo));
};

export const getUserInfo = (): object | null => {
  const userInfo = getCookie(USER_COOKIE);
  if (userInfo) {
    try {
      return JSON.parse(userInfo);
    } catch (error) {
      console.error('Error parsing user info from cookie', error);
      return null;
    }
  }
  return null;
};

export const removeUserInfo = () => {
  removeCookie(USER_COOKIE);
};

export const clearAuthCookies = () => {
  removeAuthToken();
  removeUserInfo();
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};