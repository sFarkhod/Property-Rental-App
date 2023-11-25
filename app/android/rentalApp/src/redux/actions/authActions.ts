export const SET_TOKEN = "SET_TOKEN";

export const setToken = (tokens: { access: string; refresh: string }) => ({
  type: SET_TOKEN,
  payload: tokens,
}) as const;
