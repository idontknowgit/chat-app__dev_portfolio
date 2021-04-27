import apiCaller from "../apiCaller";

export const login = (credentials, isRegistering) =>
  apiCaller.post(isRegistering ? "/auth/register" : "/auth/login", credentials);

export const refresh = () =>
  apiCaller.get("/auth/refresh", { ignoreTracking: true });

export const logout = () => apiCaller.get("/auth/logout");
