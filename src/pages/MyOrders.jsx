
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyOrders } from "../api/orders";
import "./MyOrders.css";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOrders() {
      try {
        setLoading(true);
        setError("");

        const response = await getMyOrders();

        const result = Array.isArray(response)
          ? response
          : response?.data ?? response?.orders ?? [];

        if (!Array.isArray(result)) {
          throw new Error("Invalid orders response.");
        }

        setOrders(result);
      } catch (err) {
        setError(
          err.response?.data?.message ||
          err.message ||
          "Failed to load orders."
        );
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, []);

  function formatDate(date) {
    if (!date) return "Date unavailable";

    const value = new Date(date);

    return Number.isNaN(value.getTime())
      ? "Date unavailable"
      : value.toLocaleString();
  }

  if (loading) {
    return (
      <div className="orders-page">
        <h1>My Orders</h1>
        <p>Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-header">
        <h1>My Orders</h1>
        <p>View your previous purchases.</p>
      </div>

      {error && (
        <p className="orders-error">{error}</p>
      )}

      {!error && orders.length === 0 && (
        <div className="orders-empty">
          <h2>No orders yet</h2>
          <p>You haven't placed any orders.</p>
          <Link to="/">Browse Products</Link>
        </div>
      )}

      <div className="orders-list">
        {orders.map((order) => (
          <div className="order-card" key={order.id}>
            <div className="order-card-header">
              <div>
                <h2>Order #{order.orderNumber}</h2>
                <p>
                  Placed on {formatDate(order.createdAt)}
                </p>
              </div>

              <div className="order-total">
                <span>Order Total</span>
                <strong>
                  €{Number(order.totalAmount ?? 0).toFixed(2)}
                </strong>
              </div>
            </div>

            <div className="order-items">
              {(order.orderItems ?? []).map((item) => (
                <div className="order-item" key={item.id}>
                  <div className="order-item-image">
                    {item.product?.imageUrl ? (
                      <img
                        src={item.product.imageUrl}
                        alt={
                          item.product.productName ||
                          "Product"
                        }
                      />
                    ) : (
                      <span>No image</span>
                    )}
                  </div>

                  <div className="order-item-info">
                    <h3>
                      {item.product?.productName ??
                        "Product unavailable"}
                    </h3>

                    <p>Quantity: {item.quantity}</p>

                    <p>
                      Seller:{" "}
                      {item.product?.username ??
                        "Not available"}
                    </p>
                  </div>

                  <div className="order-item-price">
                    €{Number(item.totalAmount ?? 0).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="order-card-footer">
              <span>
                {order.orderItems?.length ?? 0} product type(s)
              </span>

              <strong>
                Total: €{Number(order.totalAmount ?? 0).toFixed(2)}
              </strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyOrders;
