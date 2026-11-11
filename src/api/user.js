
import apiClient from "./apiClient";

export async function getProfile() {
  const response = await apiClient.get("/User/profile");
  return response.data;
}

export async function getBalance() {
  const response = await apiClient.get("/User/balance");
  return response.data;
}


export async function updateBalance(amount) {
  const response = await apiClient.post(
    "/User/updateBalance",
    null,
    {
      params: {
        amount: Number(amount),
      },
    }
  );

  return response.data;
}
