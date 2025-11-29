let accessToken: string | null = null;
// in all of these projects, tokens are in localStorage beacuse they are local projects, 
// if i would make it to prod someday it would be in http only cookie for more protection 😀
export const tokenService = {
  setTokens: (access: string, refresh: string) => {
    accessToken = access;
    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);
  },
  getAccessToken: () => {
    if (!accessToken) {
      accessToken = localStorage.getItem("accessToken");
    }
    return accessToken;
  },
  getRefreshToken: () => localStorage.getItem("refreshToken"),
  clear: () => {
    accessToken = null;
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  },
};
