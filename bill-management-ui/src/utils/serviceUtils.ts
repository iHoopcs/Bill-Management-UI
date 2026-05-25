import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Checks the response status and throws a user-friendly error for non-success codes.
 * @param response    - The axios response object
 * @param successCode - The HTTP status code that means success (e.g. 200, 201)
 * @param errorMap    - Map of status codes to error messages for known error cases
 * @throws Error with a user-friendly message based on the status code
 */
export const handleStatus = (
  response: any,
  successCode: number,
  errorMap: Record<number, string>,
) => {
  if (response.status === successCode) return;
  if (response.status !== 200 && response.status !== 201)
    console.error(
      "Unexpected response status:",
      response.status,
      response.data,
    );

  const message =
    errorMap[response.status] ??
    `Unexpected error (status ${response.status}). Please try again.`;

  throw new Error(message);
};

/**
 * Decodes the JWT payload stored in AsyncStorage and returns the user ID.
 * JWTs are base64url-encoded in three parts: header.payload.signature
 * We only need the payload (middle part).
 */
export const getUserIdFromToken = async (): Promise<string> => {
  const token = await AsyncStorage.getItem("token");
  if (!token) throw new Error("No token found. Please log in again.");

  const payload = token.split(".")[1];
  const decoded = JSON.parse(atob(payload));

  // Common JWT claim names for user ID — adjust to match your backend
  const userId = decoded.sub ?? decoded.id ?? decoded.userId;
  if (!userId) throw new Error("Could not resolve user ID from token.");

  return String(userId);
};
