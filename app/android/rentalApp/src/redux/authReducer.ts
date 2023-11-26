import { SET_TOKEN, setToken } from "./actions/authActions";
import { SET_IS_REALTOR, setIsRealtor } from "./actions/authActions";

interface AuthState {
  access: string | undefined;
  refresh: string | undefined;
  isRealtor: boolean | undefined;
}

type AuthAction = ReturnType<typeof setToken | typeof setIsRealtor >;

const initialState: AuthState = {
  access: undefined,
  refresh: undefined,
  isRealtor: false,
};

const authReducer = (state = initialState, action: AuthAction): AuthState => {
  switch (action.type) {
    case SET_TOKEN:
      return { ...state, access: action.payload.access, refresh: action.payload.refresh, };
    case SET_IS_REALTOR:
      return { ...state, isRealtor: action.payload };
    default:
      return state;
  }
};

export default authReducer;
