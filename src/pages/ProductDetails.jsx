
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getProductById } from "../api/products";
import { addToCart } from "../api/cart";
import "./Products.css";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        setError("");

        const data = await getProductById(id);
        const result = data.data ?? data.product ?? data;

        if (!result || !result.id) {
          throw new Error("Product not found.");
        }

        setProduct(result);
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
  }, [id]);

  async function handleAddToCart() {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const amount = Number(quantity);
    const stock = Number(product.stock ?? 0);

    if (
      !Number.isInteger(amount) ||
      amount < 1 ||
      amount > stock
    ) {
      setError("Please select a valid quantity.");
      return;
    }

    try {
      setAdding(true);
      setError("");
      setMessage("");

      const result = await addToCart(product.id, amount);

      if (result?.success === false) {
        throw new Error(result.message || "Could not add product.");
      }

      setMessage("Product added to cart successfully!");
      setQuantity(1);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Could not add product to cart."
      );
    } finally {
      setAdding(false);
    }
  }

  if (loading) {
    return <div className="products-page">Loading product...</div>;
  }

  if (!product) {
    return (
      <div className="products-page">
        <p>{error || "Product not found."}</p>
        <Link to="/">Back to Products</Link>
      </div>
    );
  }

  const name = product.productName ?? product.name;
  const description =
    product.productDescription ?? product.description;
  const price = Number(
    product.productPrice ?? product.price ?? 0
  );
  const stock = Number(product.stock ?? 0);

  return (
    <div className="products-page">
      <Link to="/">← Back to Products</Link>

      <div className="product-details">
        <div className="product-image">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={name} />
          ) : (
            <span>No image available</span>
          )}
        </div>

        <div className="product-info">
          <h1>{name}</h1>
          <p>{description}</p>

          <h2>€{price.toFixed(2)}</h2>

          <p>
            {stock > 0
              ? `Available stock: ${stock}`
              : "Out of stock"}
          </p>

          <p>
            Seller:{" "}
            {product.sellerName ??
              product.username ??
              "Not available"}
          </p>

          <div className="quantity-selector">
            <label htmlFor="quantity">Quantity:</label>

            <input
              id="quantity"
              type="number"
              min="1"
              max={Math.max(stock, 1)}
              step="1"
              value={quantity}
              disabled={stock <= 0 || adding}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>

          <button
            onClick={handleAddToCart}
            disabled={stock <= 0 || adding}
          >
            {adding ? "Adding..." : "Add to Cart"}
          </button>

          {error && <p className="error-message">{error}</p>}
          {message && <p>{message}</p>}

          <p>
            <Link to="/cart">View Shopping Cart</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
