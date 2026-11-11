
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getMyCart,
  removeFromCart,
  placeOrder,
} from "../api/cart";
import { getBalance } from "../api/user";
import "./Products.css";

function Cart() {
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [removingId, setRemovingId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  function extractBalance(data) {
    const value =
      typeof data === "number"
        ? data
        : data?.walletBalance ??
          data?.balance ??
          data?.data?.walletBalance ??
          data?.data?.balance ??
          data?.data;

    if (value === null || value === undefined || value === "") {
      return null;
    }

    const number = Number(value);
    return Number.isFinite(number) ? number : null;
  }

  async function loadCart() {
    try {
      setLoading(true);
      setError("");

      const [cartData, balanceData] = await Promise.all([
        getMyCart(),
        getBalance(),
      ]);

      setCart(cartData?.data ?? cartData?.cart ?? cartData);
      setBalance(extractBalance(balanceData));
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Failed to load your shopping cart."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCart();
  }, []);

  async function handleRemove(id) {
    if (!window.confirm("Remove this product from your cart?")) {
      return;
    }

    try {
      setRemovingId(id);
      setError("");
      setMessage("");

      const response = await removeFromCart(id);

      if (response?.success === false) {
        throw new Error(response.message || "Remove failed.");
      }

      await loadCart();
      setMessage("Product removed from your cart.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Failed to remove product."
      );
    } finally {
      setRemovingId(null);
    }
  }

  async function handleCheckout() {
    if (!cart?.items?.length) {
      setError("Your cart is empty.");
      return;
    }

    const total = Number(cart.totalAmount ?? 0);

    if (balance === null) {
      setError(
        "Unable to verify your wallet balance. Please refresh."
      );
      return;
    }

    if (total > balance) {
      setError(
        "Insufficient wallet balance. Please add money to your wallet."
      );
      return;
    }

    const confirmed = window.confirm(
      `Place this order for €${total.toFixed(2)}?`
    );

    if (!confirmed) return;

    try {
      setProcessing(true);
      setError("");
      setMessage("");

      const response = await placeOrder();

      if (response?.success === false) {
        throw new Error(response.message || "Checkout failed.");
      }

      await loadCart();
      navigate("/my-orders");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Checkout failed. Please try again."
      );
    } finally {
      setProcessing(false);
    }
  }

  if (loading && !cart) {
    return (
      <div className="products-page">
        <p>Loading your shopping cart...</p>
      </div>
    );
  }

  const items = Array.isArray(cart?.items)
    ? cart.items
    : [];

  const total = Number(cart?.totalAmount ?? 0);
  const insufficientBalance =
    balance !== null && total > balance;

  return (
    <div className="products-page">
      <h1>Shopping Cart</h1>
      <p>Review your products before checkout.</p>

      {error && (
        <p className="error-message">{error}</p>
      )}

      {message && (
        <p className="success-message">{message}</p>
      )}

      {items.length === 0 ? (
        <div className="empty-products">
          <h2>Your cart is empty</h2>
          <p>Start shopping to add products.</p>
          <Link to="/">Browse Products</Link>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {items.map((item) => (
              <div
                className="cart-item"
                key={item.id}
              >
                <div>
                  <h3>{item.productName}</h3>

                  <p>Quantity: {item.quantity}</p>

                  <p>
                    Unit Price: €
                    {Number(item.productPrice ?? 0).toFixed(2)}
                  </p>

                  <p>
                    Total: €
                    {Number(item.totalAmount ?? 0).toFixed(2)}
                  </p>
                </div>

                <button
                  onClick={() => handleRemove(item.id)}
                  disabled={
                    removingId === item.id ||
                    processing ||
                    loading
                  }
                >
                  {removingId === item.id
                    ? "Removing..."
                    : "Remove"}
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>Order Summary</h2>

            <p>
              Wallet Balance:{" "}
              <strong>
                {balance !== null
                  ? `€${balance.toFixed(2)}`
                  : "Unavailable"}
              </strong>
            </p>

            <h3>Total: €{total.toFixed(2)}</h3>

            {insufficientBalance && (
              <p className="error-message">
                Your wallet balance is insufficient.
                Please add money before checkout.
              </p>
            )}

            <div className="checkout-actions">
              <Link to="/profile">
                Manage Wallet
              </Link>

              <button
                onClick={handleCheckout}
                disabled={
                  processing ||
                  loading ||
                  balance === null ||
                  insufficientBalance
                }
              >
                {processing
                  ? "Processing..."
                  : "Place Order"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
