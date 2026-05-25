import apiClient from "../config/apiClient";
import { getUserIdFromToken, handleStatus } from "@/utils/serviceUtils";
import { User } from "../models/user";

export const userService = {
  /**
   * Retrieves the user details for the currently authenticated user.
   * @return The user details
   * @throws Error if the retrieval fails due to permissions or if the user is not found
   */
  getUser: async (): Promise<User> => {
    const response = await apiClient.get(`/api/users/me`);
    console.log("getUser response:", response);

    handleStatus(response, 200, {
      401: "Session expired. Please log in again.",
      404: "User not found.",
    });

    return response.data as User;
  },
};
