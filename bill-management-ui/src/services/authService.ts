import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

import apiClient from "../config/apiClient";
import { handleStatus } from "@/utils/serviceUtils";

export const authService = {
  /**
   * Attempts to log in with the provided email and password.
   * @param email The user's email address
   * @param password The user's password
   * @returns A promise that resolves when the login is complete
   * @throws Error if the email or password is missing, if the login details are invalid, or if a network/server error occurs
   */
  login: async (email: string, password: string) => {
    if (!email || !password) throw new Error("Email and password are required");

    try {
      const response = await apiClient.post("/api/auth/login", {
        email,
        password,
      });
      console.log("Login response:", response);

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
      console.error("Login error:", error);
      throw new Error("Something went wrong while trying to log in.");
    }
  },

  /**
   * Attempts to register a new account with the provided details.
   * @param firstName The user's first name
   * @param lastName The user's last name
   * @param email The user's email address
   * @param password The user's password
   * @returns A promise that resolves when the registration is complete
   * @throws Error if any fields are missing, if the registration details are invalid, if an account with the email already exists, or if a network/server error occurs
   */
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

      console.log("Registration response:", response);

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
      console.error("Registration error:", error);
      throw new Error("Something went wrong while trying to register.");
    }
  },

  logout: async () => {
    await AsyncStorage.removeItem("token");
    router.replace("/screens/LoginScreen");
  },
};
