
import apiClient from "./apiClient";

export async function getMyOrders() {
  const response = await apiClient.get(
    "/Product/my-orders"
  );

  return response.data;
}
