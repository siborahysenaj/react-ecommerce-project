
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Header from "./components/Header";
import RequireAuth from "./components/RequireAuth";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductDetails from "./pages/ProductDetails";
import MyProducts from "./pages/MyProducts";
import ProductForm from "./pages/ProductForm";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import MyOrders from "./pages/MyOrders";

function App() {
  return (
    <BrowserRouter>
      <Header />

      <Routes>
        {/* Login and Register remain accessible */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* All shopping pages require login */}
        <Route element={<RequireAuth />}>
          <Route path="/" element={<Home />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/my-products" element={<MyProducts />} />
          <Route path="/products/create" element={<ProductForm />} />
          <Route path="/products/edit/:id" element={<ProductForm />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/my-orders" element={<MyOrders />} />
        </Route>

        {/* Unknown URLs return to Home or Login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
