import { SET_TOKEN, setToken } from "./actions/authActions";

interface AuthState {
  access: string | undefined;
  refresh: string | undefined;
}

type AuthAction = ReturnType<typeof setToken>;

const initialState: AuthState = {
  access: undefined,
  refresh: undefined,
};

const authReducer = (state = initialState, action: AuthAction): AuthState => {
  switch (action.type) {
    case SET_TOKEN:
      console.log(state, 'in authreducer')
      return { ...state, access: action.payload.access, refresh: action.payload.refresh };
    default:
      return state;
  }
};

export default authReducer;
