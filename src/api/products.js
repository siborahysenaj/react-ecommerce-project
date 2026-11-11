
import apiClient from "./apiClient";

export async function getAllProducts() {
  const response = await apiClient.get("/Product/all");
  return response.data;
}

export async function getProductById(id) {
  const response = await apiClient.get(`/Product/${id}`);
  return response.data;
}

export async function getMyProducts() {
  const response = await apiClient.get("/Product/my-products");
  return response.data;
}

export async function updateProduct(product) {
  const response = await apiClient.post("/Product/update", product);
  return response.data;
}

export async function deleteProduct(id) {
  const response = await apiClient.post(
    `/Product/delete/${id}`
  );

  return response.data;
}

export async function createProduct(product) {
  const response = await apiClient.post(
    "/Product/create",
    product
  );

  return response.data;
}
