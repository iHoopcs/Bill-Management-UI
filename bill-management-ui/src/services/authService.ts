import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

import apiClient from "./apiClient";

/**
 * Checks the response status and throws a user-friendly error for non-success codes.
 * @param response   - The axios response object
 * @param successCode - The HTTP status code that means success (e.g. 200, 201)
 * @param errorMap   - Map of status codes to error messages for known error cases
 */
const handleStatus = (
  response: any,
  successCode: number,
  errorMap: Record<number, string>,
) => {
  if (response.status === successCode) return;

  const message =
    errorMap[response.status] ??
    `Unexpected error (status ${response.status}). Please try again.`;

  throw new Error(message);
};

export const authService = {
  login: async (email: string, password: string) => {
    if (!email || !password) throw new Error("Email and password are required");

    try {
      const response = await apiClient.post("/api/auth/login", {
        email,
        password,
      });

      handleStatus(response, 201, {
        400: "Invalid login details. Please check your email and password.",
        401: "Incorrect email or password.",
        500: "A server error occurred. Please try again later.",
      });

      // Persist the token so apiClient attaches it to all future requests
      const token = response.data?.token;
      if (token) {
        await AsyncStorage.setItem("token", token);
      }

      router.replace("/screens/DashboardScreen");
    } catch (error: any) {
      if (error.message && !error.isAxiosError) throw error;
      throw new Error("Something went wrong while trying to log in.");
    }
  },

  register: async (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ) => {
    if (!firstName || !lastName || !email || !password) {
      throw new Error("All fields are required");
    }
    try {
      const response = await apiClient.post("/api/auth/register", {
        firstName,
        lastName,
        email,
        password,
      });

      handleStatus(response, 201, {
        400: "Invalid registration details. Please check your information.",
        409: "An account with this email already exists.",
        500: "A server error occurred. Please try again later.",
      });

      router.replace({
        pathname: "/screens/LoginScreen",
        params: { registered: "true" },
      });
      return;
    } catch (error: any) {
      // Re-throw errors we deliberately threw above unchanged
      // Only wrap genuine network/unexpected errors
      if (error.message && !error.isAxiosError) {
        throw error;
      }
      throw new Error("Something went wrong while trying to register.");
    }
  },

  logout: async () => {
    await AsyncStorage.removeItem("token");
    router.replace("/screens/LoginScreen");
  },
};
