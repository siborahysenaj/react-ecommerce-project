
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Header.css";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(localStorage.getItem("token"))
  );

  useEffect(() => {
    const updateAuth = () => {
      setIsLoggedIn(Boolean(localStorage.getItem("token")));
    };

    updateAuth();

    window.addEventListener("auth-changed", updateAuth);
    window.addEventListener("storage", updateAuth);

    return () => {
      window.removeEventListener("auth-changed", updateAuth);
      window.removeEventListener("storage", updateAuth);
    };
  }, [location.pathname]);

  function handleLogout() {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("auth-changed"));
    setIsLoggedIn(false);
    navigate("/login", { replace: true });
  }

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          ShopEase
        </Link>

        <nav className="navbar">
          {isLoggedIn ? (
            <>
              <Link to="/">Home</Link>
              <Link to="/my-products">My Products</Link>
              <Link to="/cart">Cart</Link>
              <Link to="/my-orders">My Orders</Link>
              <Link to="/profile">Profile</Link>

              <button
                type="button"
                className="logout-btn"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
