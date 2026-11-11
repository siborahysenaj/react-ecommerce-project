
import apiClient from "./apiClient";

export async function login(username, password) {
  const response = await apiClient.post("/Auth/login", {
    username,
    password,
  });

  return response.data;
}

export async function register(formData) {
  const response = await apiClient.post("/Auth/register", {
    username: formData.username,
    email: formData.email,
    password: formData.password,
    confirmPassword: formData.confirmPassword,
  });

  return response.data;
}
