
import apiClient from "./apiClient";

export async function addToCart(productId, quantity) {
  const response = await apiClient.post(
    "/Product/add-to-cart",
    {
      productId: Number(productId),
      quantity: Number(quantity),
    }
  );

  return response.data;
}

export async function getMyCart() {
  const response = await apiClient.get("/Product/my-cart");
  return response.data;
}

export async function removeFromCart(id) {
  const response = await apiClient.post(
    `/Product/remove-from-cart/${id}`
  );
  return response.data;
}

export async function placeOrder() {
  const response = await apiClient.post("/Product/place-order");
  return response.data;
}
