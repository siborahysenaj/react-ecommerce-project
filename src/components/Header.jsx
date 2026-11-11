import { Link } from "react-router-dom";
import "./Header.css";

function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          ShopEase
        </Link>

        <nav className="navbar">
          <Link to="/">Home</Link>
          <Link to="/my-products">My Products</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/my-orders">My Orders</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;