import { useState } from "react";
import { Alert } from "react-native";
import Toast from "react-native-toast-message";
import { SET_TOKEN, setIsRealtor, setToken } from "../src/redux/actions/authActions";
import store from "../src//redux/store";

const baseURL = "https://absolute-initially-slug.ngrok-free.app/";

interface RegisterUserData {
  username?: string;
  email?: string;
  password?: string;
  phone_number?: string;
  is_realtor?: boolean;
}

export interface LoginResult {
  success: boolean;
  tokens?: {
    access: string;
    refresh: string;
  };
  is_realtor?: boolean;
  errorMessage?: string;
}

interface LoginCredentials {
  username: string;
  password: string;
}

export const registerUser = async (
  userData: RegisterUserData
): Promise<boolean> => {
  try {
    const response = await fetch(`${baseURL}/sign-up/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();

      if (response.status === 400 && errorData) {
        const errors = Object.entries(errorData).map(
          // @ts-ignore
          ([key, value]) => `${key}: ${value.join(", ")}`
        );
        Alert.alert("Registration Failed", errors.join("\n"));
      } else {
        throw new Error(errorData.detail || "An error occurred");
      }
      return false;
    } else {
      return true;
    }
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

export const loginUser = async (
  credentials: LoginCredentials
): Promise<LoginResult> => {
  try {
    const response = await fetch(`${baseURL}/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const loginErrorData = await response.json();

      if (response.status === 400 && loginErrorData) {
        const errors = Object.entries(loginErrorData).map(
          // @ts-ignore
          ([key, value]) => `${key}: ${value.join(", ")}`
        );
        Alert.alert("Login Failed", errors.join("\n"));
      } else {
        throw new Error(loginErrorData.detail || "An error occurred");
      }
      return { success: false };
    } else {
      const responseData = await response.json();
      const { tokens } = responseData;
      const { is_realtor } = responseData;

      // console.log(is_realtor)

      if (is_realtor !== undefined) {
        store.dispatch(setIsRealtor(is_realtor));
      }

      if (tokens) {
        store.dispatch(setToken(tokens));
        return { success: true, tokens, is_realtor };
      } else {
        throw new Error("Tokens not received in the response");
      }
    }
  } catch (error) {
    // @ts-ignore
    // Alert.alert(error);
    Toast.show({
      type: "error",
      position: "bottom",
      text1: "Login Failed",
      // @ts-ignore
      text2: error.message,
    });

    // @ts-ignore
    return { success: false, errorMessage: error.message };
  }
};
