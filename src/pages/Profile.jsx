
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getProfile,
  getBalance,
  updateBalance,
} from "../api/user";
import "./Profile.css";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [amount, setAmount] = useState("");
  const [updating, setUpdating] = useState(false);
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

  async function loadProfile() {
    try {
      setLoading(true);
      setError("");

      const [profileData, balanceData] = await Promise.all([
        getProfile(),
        getBalance(),
      ]);

      const user =
        profileData?.data ??
        profileData?.user ??
        profileData;

      setProfile(user);
      setBalance(extractBalance(balanceData));
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load profile information."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProfile();
  }, []);

  async function handleTopUp(event) {
    event.preventDefault();

    const value = Number(amount);

    if (!Number.isFinite(value) || value <= 0) {
      setError("Please enter a valid amount greater than zero.");
      return;
    }

    try {
      setUpdating(true);
      setError("");
      setMessage("");

      await updateBalance(value);

      const balanceData = await getBalance();
      setBalance(extractBalance(balanceData));

      setAmount("");
      setMessage("Your wallet has been updated successfully!");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to update wallet balance."
      );
    } finally {
      setUpdating(false);
    }
  }

  if (loading) {
    return (
      <div className="profile-page">
        <p>Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <h1>My Profile</h1>
      <p>Manage your account and wallet.</p>

      {error && <p className="error-message">{error}</p>}

      {profile && (
        <>
          <div className="profile-card">
            <h2>Personal Information</h2>

            <div className="profile-field">
              <strong>Username</strong>
              <span>{profile.username ?? "Not available"}</span>
            </div>

            <div className="profile-field">
              <strong>Email</strong>
              <span>{profile.email ?? "Not available"}</span>
            </div>

            <div className="profile-field">
              <strong>Products Sold</strong>
              <span>{profile.productsSold ?? 0}</span>
            </div>

            <div className="profile-field">
              <strong>Products Bought</strong>
              <span>{profile.productsBought ?? 0}</span>
            </div>
          </div>

          <div className="profile-card wallet-card">
            <h2>My Wallet</h2>

            <p>Available Balance</p>

            <h1>
              {balance !== null
                ? `€${balance.toFixed(2)}`
                : "Balance unavailable"}
            </h1>

            <p>
              Your wallet is used to purchase products
              through the store.
            </p>

            <form
              onSubmit={handleTopUp}
              className="wallet-form"
            >
              <label htmlFor="topUpAmount">
                Add Money to Wallet
              </label>

              <input
                id="topUpAmount"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="Enter amount (€)"
                value={amount}
                onChange={(event) =>
                  setAmount(event.target.value)
                }
                required
              />

              <button type="submit" disabled={updating}>
                {updating ? "Updating..." : "Add Money"}
              </button>
            </form>

            {message && (
              <p className="success-message">{message}</p>
            )}
          </div>

          <div className="profile-links">
            <Link to="/my-products">
              Manage My Products
            </Link>

            <Link to="/my-orders">
              View Order History
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

export default Profile;
