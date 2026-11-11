
import { BrowserRouter, Routes, Route } from "react-router-dom";

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
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/products/:id"
          element={<ProductDetails />}
        />

        <Route element={<RequireAuth />}>
          <Route
            path="/my-products"
            element={<MyProducts />}
          />
          <Route
            path="/products/create"
            element={<ProductForm />}
          />
          <Route
            path="/products/edit/:id"
            element={<ProductForm />}
          />
          <Route path="/cart" element={<Cart />} />
          <Route path="/profile" element={<Profile />} />
          <Route
            path="/my-orders"
            element={<MyOrders />}
          />
        </Route>

        <Route
          path="*"
          element={
            <main style={{ padding: "40px" }}>
              <h1>Page Not Found</h1>
              <p>The page you requested does not exist.</p>
            </main>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
