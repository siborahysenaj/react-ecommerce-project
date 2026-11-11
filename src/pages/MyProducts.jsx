
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getMyProducts,
  deleteProduct,
} from "../api/products";
import "./Products.css";

function MyProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  async function loadProducts() {
    try {
      setLoading(true);
      setError("");

      const response = await getMyProducts();

      const result = Array.isArray(response)
        ? response
        : response?.products ?? response?.data ?? [];

      if (!Array.isArray(result)) {
        throw new Error("Invalid products response.");
      }

      setProducts(result);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Failed to load your products."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function handleDelete(id) {
    if (!window.confirm("Delete this product?")) {
      return;
    }

    try {
      setDeletingId(id);
      setError("");
      setMessage("");

      const response = await deleteProduct(id);

      if (response?.success === false) {
        throw new Error(
          response.message || "Failed to delete product."
        );
      }

      setMessage("Product deleted successfully.");
      await loadProducts();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Failed to delete product."
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="products-page">
      <div className="my-products-header">
        <div>
          <h1>My Products</h1>
          <p>Manage your products for sale.</p>
        </div>

        <Link
          to="/products/create"
          className="create-product-btn"
        >
          + Add New Product
        </Link>
      </div>

      {error && (
        <p className="error-message">{error}</p>
      )}

      {message && <p>{message}</p>}

      {loading ? (
        <p>Loading products...</p>
      ) : products.length === 0 && !error ? (
        <div className="empty-products">
          <h2>No products yet</h2>
          <p>You haven't created any products.</p>

          <Link to="/products/create">
            Create Your First Product
          </Link>
        </div>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <div
              className="product-card"
              key={product.id}
            >
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.productName}
                  className="product-card-image"
                />
              ) : (
                <div className="product-card-image">
                  No image available
                </div>
              )}

              <div className="product-card-content">
                <h3>{product.productName}</h3>

                <p>{product.productDescription}</p>

                <h3>
                  €{Number(product.productPrice ?? 0).toFixed(2)}
                </h3>

                <p>Stock: {product.stock}</p>

                <div className="product-actions">
                  <Link
                    to={`/products/edit/${product.id}`}
                  >
                    Edit
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleDelete(product.id)}
                    disabled={deletingId === product.id}
                  >
                    {deletingId === product.id
                      ? "Deleting..."
                      : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyProducts;
