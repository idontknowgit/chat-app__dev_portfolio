import apiCaller from "../apiCaller";

export const create = (params) => apiCaller.post("/room", params);
