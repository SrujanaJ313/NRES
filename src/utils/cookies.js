export const CookieNames = {
  ACCESS_TOKEN: "resea.token",
  REFRESH_TOKEN: "resea.refreshToken",
  USER_ID: "resea.userId",
  USER_ROLE: "resea.userRole",
  USER: "resea.user",
};

export const setCookieItem = (cName, cValue, expDays) => {
  const cookieDetails = `${cName}=${cValue};`;
  if (expDays) {
    const expires = `expires=${expDays};`;
    document.cookie = `${cookieDetails} ${expires} path=/`;
  } else {
    document.cookie = `${cookieDetails} path=/`;
  }
};

export const getCookieItem = (cName) => {
  const match = document.cookie.match(new RegExp(`(^| )${cName}=([^;]+)`));
  if (match) return match[2];
  return "";
};

export const removeCookieItem = (name) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

export function getTokenExpiry() {
  const addThirtyDays = 30 * 24 * 60 * 60 * 1000;
  const currentDate = new Date();
  const futureDate = new Date(currentDate.getTime() + addThirtyDays);
  return futureDate.toUTCString();
}

// export function getRefreshTokenExpiry() {
//   const addTenDays = 240 * 60 * 60 * 1000;
//   const currentDate = new Date();
//   const futureDate = new Date(currentDate.getTime() + addTenDays);
//   return futureDate.toUTCString();
//   // return new Date(2147483647 * 1000).toUTCString();
// }

export const setSession = (sessionData) => {
  const { accessToken, refreshToken, userRole, userData } = sessionData;
  const { userName, accessLevel, userId } = userData;

  const tokenExpiry = getTokenExpiry();
  setCookieItem(CookieNames.ACCESS_TOKEN, accessToken, tokenExpiry);
  setCookieItem(CookieNames.USER_ID, userId, tokenExpiry);
  setCookieItem(CookieNames.REFRESH_TOKEN, refreshToken, tokenExpiry);
  setCookieItem(CookieNames.USER_ROLE, accessLevel, tokenExpiry);
  setCookieItem(CookieNames.USER, JSON.stringify(userData), tokenExpiry);
};

export const clearAccessTokenInSession = () => {
  removeCookieItem(CookieNames.ACCESS_TOKEN);
};

export const setAccessTokenInSession = (token) => {
  setCookieItem(CookieNames.ACCESS_TOKEN, token, getTokenExpiry());
};

export const setAccessAndRefreshTokenInSession = (
  accessTokens,
  refreshToken
) => {
  setCookieItem(CookieNames.ACCESS_TOKEN, accessTokens, getTokenExpiry());
  setCookieItem(CookieNames.REFRESH_TOKEN, refreshToken, getTokenExpiry());
};

export const clearSession = (redirectToHome = false) => {
  removeCookieItem(CookieNames.ACCESS_TOKEN);
  removeCookieItem(CookieNames.USER_ID);
  removeCookieItem(CookieNames.REFRESH_TOKEN);
  removeCookieItem(CookieNames.USER_ROLE);
  removeCookieItem(CookieNames.USER);

  if (redirectToHome) window.location.href = "/auth/login";
};

export const getSession = () => {
  return {
    accessToken: getCookieItem(CookieNames.ACCESS_TOKEN),
    user: getCookieItem(CookieNames.USER)
      ? JSON.parse(getCookieItem(CookieNames.USER))
      : null,
  };
};

export const getUserName = () => {
  return getCookieItem(CookieNames.USER)
    ? JSON.parse(getCookieItem(CookieNames.USER)).userName
    : "";
};

export const isUpdateAccessExist = () => {
  return getCookieItem(CookieNames.USER)
    ? JSON.parse(getCookieItem(CookieNames.USER)).accessLevel === "UPDATE"
    : false;
};
