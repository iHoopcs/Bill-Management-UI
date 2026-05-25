import axios from "axios";
import { router } from "expo-router";
import { API_BASE_URL } from "@/config/api";

export const authService = {
  login: async (email: string, password: string) => {},

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
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/register`,
        {
          firstName,
          lastName,
          email,
          password,
        },
        {
          // Tell axios NOT to throw on non-2xx so we can handle each status ourselves
          validateStatus: () => true,
        },
      );

      switch (response.status) {
        case 201:
          router.replace({
            pathname: "/screens/LoginScreen",
            params: { registered: "true" },
          });
          return;
        case 400:
          throw new Error(
            "Invalid registration details. Please check your information.",
          );
        case 409:
          throw new Error("An account with this email already exists.");
        case 500:
          throw new Error("A server error occurred. Please try again later.");
        default:
          throw new Error(
            `Unexpected error (status ${response.status}). Please try again.`,
          );
      }
    } catch (error: any) {
      // Re-throw errors we deliberately threw above unchanged
      // Only wrap genuine network/unexpected errors
      if (error.message && !error.isAxiosError) {
        throw error;
      }
      throw new Error(
        "Network error. Please check your connection and try again.",
      );
    }
  },
};
