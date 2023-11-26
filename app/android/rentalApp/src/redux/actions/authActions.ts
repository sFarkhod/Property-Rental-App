export const SET_TOKEN = "SET_TOKEN";

export const setToken = (tokens: { access: string; refresh: string; }) => ({
  type: SET_TOKEN,
  payload: tokens,
}) as const;


export const SET_IS_REALTOR = "SET_IS_REALTOR";

export const setIsRealtor = (isRealtor: boolean) => ({
  type: SET_IS_REALTOR,
  payload: isRealtor,
}) as const;