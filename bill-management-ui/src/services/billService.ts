import apiClient from "@/config/apiClient";
import { Bill, CreateBillDto, UpdateBillDto } from "@/models/bill";
import { getUserIdFromToken, handleStatus } from "@/utils/serviceUtils";

export const billService = {
  /**
   * Retrieves the bill details for the specified bill ID.
   * @param billId
   * @return The bill details
   * @throws Error if the bill ID is missing or if the retrieval fails due to permissions or if the bill is not found
   */
  getBill: async (billId: string): Promise<Bill> => {
    const response = await apiClient.get(`/api/bills/individual/${billId}`);

    handleStatus(response, 200, {
      401: "Session expired. Please log in again.",
      403: "You do not have permission to view this bill.",
      404: "Bill not found.",
    });

    return response.data as Bill;
  },

  /**
   * Retrieves all bills associated with the currently authenticated user.
   * @return List of bills for the user
   * @throws Error if the retrieval fails due to permissions or if the user is not found
   */
  getBillsForUser: async (): Promise<Bill[]> => {
    const userId = await getUserIdFromToken();
    if (!userId) throw new Error("User ID is required to retrieve bills.");
    const response = await apiClient.get(`/api/bills/all/${userId}/`);
    console.log("getBillsForUser response:", response);

    handleStatus(response, 200, {
      401: "Session expired. Please log in again.",
      403: "You do not have permission to view these bills.",
      404: "User not found.",
    });

    return response.data as Bill[];
  },

  /**
   * Creates a new bill with the provided details. The user ID is automatically associated from the JWT.
   * @param billData
   * @returns The created bill details
   * @throws Error if required fields are missing or if the creation fails due to validation or permissions
   */
  createBill: async (billData: CreateBillDto): Promise<Bill> => {
    if (!billData.name || !billData.amount || !billData.dueDate)
      throw new Error(
        "Name, amount, and due date are required to create a bill.",
      );

    const userId = await getUserIdFromToken();
    const response = await apiClient.post("/api/bills", {
      ...billData,
      user: userId,
    });

    handleStatus(response, 201, {
      400: "Invalid bill data. Please check the details and try again.",
      401: "Session expired. Please log in again.",
      403: "You do not have permission to create a bill.",
    });

    return response.data as Bill;
  },

  /**
   * Updates the specified bill with the provided details. Only fields included in billData will be updated.
   * @param billId
   * @param billData
   * @returns The updated bill details
   * @throws Error if billId is missing, billData is empty, or if the update fails due to validation or permissions
   */
  updateBill: async (
    billId: string,
    billData: UpdateBillDto,
  ): Promise<Bill> => {
    if (!billId) throw new Error("Bill ID is required to update a bill.");
    if (Object.keys(billData).length === 0)
      throw new Error("At least one field must be provided to update.");
    const response = await apiClient.put(`/api/bills/${billId}`, billData);

    handleStatus(response, 200, {
      400: "Invalid bill data. Please check the details and try again.",
      401: "Session expired. Please log in again.",
      403: "You do not have permission to update this bill.",
      404: "Bill not found.",
    });

    return response.data as Bill;
  },

  /**
   * Deletes the specified bill.
   * @param billId
   * @returns
   * @throws Error if billId is missing or if the deletion fails due to permissions or if the bill is not found
   */
  deleteBill: async (billId: string): Promise<void> => {
    if (!billId) throw new Error("Bill ID is required to delete a bill.");
    const response = await apiClient.delete(`/api/bills/${billId}`);

    handleStatus(response, 204, {
      401: "Session expired. Please log in again.",
      403: "You do not have permission to delete this bill.",
      404: "Bill not found.",
    });

    return;
  },
};
