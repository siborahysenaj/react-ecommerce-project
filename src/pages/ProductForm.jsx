
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  createProduct,
  updateProduct,
  getProductById,
  getMyProducts,
} from "../api/products";
import "./Products.css";

const emptyForm = {
  productName: "",
  productDescription: "",
  productPrice: "",
  stock: "",
  imageUrl: "",
};

function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEditing) return;

    async function loadProduct() {
      try {
        setLoading(true);
        setError("");

        // Only allow editing products owned by this user.
        const data = await getMyProducts();
        const products = Array.isArray(data)
          ? data
          : data.products ?? data.data ?? [];

        const ownedProduct = products.find(
          (item) => Number(item.id) === Number(id)
        );

        if (!ownedProduct) {
          throw new Error(
            "Product not found or you do not own this product."
          );
        }

        const productData = await getProductById(id);
        const product =
          productData.data ?? productData.product ?? productData;

        setForm({
          productName: product.productName ?? "",
          productDescription: product.productDescription ?? "",
          productPrice: String(product.productPrice ?? ""),
          stock: String(product.stock ?? ""),
          imageUrl: product.imageUrl ?? "",
        });
      } catch (err) {
        setError(
          err.response?.data?.message ||
          err.message ||
          "Failed to load product."
        );
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id, isEditing]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const price = Number(form.productPrice);
    const stock = Number(form.stock);

    if (
      !form.productName.trim() ||
      !form.productDescription.trim()
    ) {
      setError("Please complete all required fields.");
      return;
    }

    if (!Number.isFinite(price) || price < 1) {
      setError("Price must be at least 1.");
      return;
    }

    if (!Number.isInteger(stock) || stock < 1) {
      setError("Stock must be a whole number of at least 1.");
      return;
    }

    const product = {
      productName: form.productName.trim(),
      productDescription: form.productDescription.trim(),
      productPrice: price,
      stock,
      imageUrl: form.imageUrl.trim(),
    };

    if (isEditing) {
      product.id = Number(id);
    }

    try {
      setSaving(true);
      setError("");

      const result = isEditing
        ? await updateProduct(product)
        : await createProduct(product);

      if (result?.success === false) {
        throw new Error(result.message || "Failed to save product.");
      }

      navigate("/my-products");
    } catch (err) {
      const serverErrors = err.response?.data?.errors;

      const validationMessage = serverErrors
        ? Object.values(serverErrors).flat().join(" ")
        : null;

      setError(
        validationMessage ||
        err.response?.data?.message ||
        err.message ||
        "Failed to save product."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="products-page">
        <p>Loading product information...</p>
      </div>
    );
  }

  return (
    <div className="products-page">
      <Link to="/my-products">← Back to My Products</Link>

      <div className="product-form-container">
        <h1>{isEditing ? "Edit Product" : "Create Product"}</h1>

        <p>
          {isEditing
            ? "Update the information for your product."
            : "Enter the details of the product you want to sell."}
        </p>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit} className="product-form">
          <label htmlFor="productName">Product Name</label>
          <input
            id="productName"
            name="productName"
            type="text"
            value={form.productName}
            onChange={handleChange}
            required
          />

          <label htmlFor="productDescription">
            Product Description
          </label>
          <textarea
            id="productDescription"
            name="productDescription"
            rows="5"
            value={form.productDescription}
            onChange={handleChange}
            required
          />

          <label htmlFor="productPrice">Price (€)</label>
          <input
            id="productPrice"
            name="productPrice"
            type="number"
            min="1"
            step="0.01"
            value={form.productPrice}
            onChange={handleChange}
            required
          />

          <label htmlFor="stock">Stock Quantity</label>
          <input
            id="stock"
            name="stock"
            type="number"
            min="1"
            step="1"
            value={form.stock}
            onChange={handleChange}
            required
          />

          <label htmlFor="imageUrl">Image URL (Optional)</label>
          <input
            id="imageUrl"
            name="imageUrl"
            type="url"
            placeholder="https://example.com/image.jpg"
            value={form.imageUrl}
            onChange={handleChange}
          />

          {form.imageUrl && (
            <div className="product-image-preview">
              <p>Image Preview</p>
              <img
                src={form.imageUrl}
                alt="Product preview"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
                onLoad={(event) => {
                  event.currentTarget.style.display = "block";
                }}
              />
            </div>
          )}

          <button type="submit" disabled={saving}>
            {saving
              ? "Saving..."
              : isEditing
                ? "Save Changes"
                : "Create Product"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProductForm;
