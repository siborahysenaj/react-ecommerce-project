
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../api/auth";
import "./Auth.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (Object.values(formData).some((value) => !value.trim())) {
      setError("Please fill in all fields.");
      return;
    }

    if (formData.username.length < 3 || formData.username.length > 20) {
      setError("Username must contain 3 to 20 characters.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const data = await register(formData);

      if (data?.success === false) {
        throw new Error(data.message || "Registration failed.");
      }

      alert("Account created successfully! Please log in.");
      navigate("/login");

    } catch (err) {
      const apiErrors = err.response?.data?.errors;

      const message = apiErrors
        ? Object.values(apiErrors).flat().join(" ")
        : err.response?.data?.message ||
          err.message ||
          "Registration failed. Please try again.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Create Account</h2>
        <p>Join ShopEase today!</p>

        {error && <p className="error-message">{error}</p>}

        <label>Username</label>
        <input
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Choose a username"
          required
        />

        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          required
        />

        <label>Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Create a password"
          required
        />

        <label>Confirm Password</label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm your password"
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Creating Account..." : "Register"}
        </button>

        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
